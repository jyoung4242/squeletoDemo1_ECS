//Collision Detections

import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { ColliderComponent } from "../Components/collider";
import { System as dcSystem, Box, Response } from "detect-collisions";
import { Signal } from "../../_Squeleto/Signals";
import { Vector } from "../../_Squeleto/Vector";
import { SizeComponent } from "../Components/sizeComponent";
import { PositionComponent } from "../Components/positionComponent";
import { UI } from "@peasy-lib/peasy-ui";
import { MapComponent } from "../Components/entitymap";
import { VelocityComponent } from "../Components/velocity";
import { over } from "lodash";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type ColliderEntity = Entity & ColliderComponent & SizeComponent & PositionComponent & MapComponent;

export type colliderBody = Box & { type: string; layerAssignment: number; layers: boolean[]; map: "" };

type npcColliderBody = Box & ColliderComponent & PositionComponent & VelocityComponent;

enum collisionResolutionType {
  wall,
  static,
  bounceback,
  destroy,
  push,
  mapevent,
  npc,
}

export class CollisionDetectionSystem extends System {
  template: string = `
  <canvas id="dc" width="400" height="225" \${==>cnv}></canvas>
  `;
  mapdata: any[];
  entities: ColliderEntity[] = [];
  mapChange: Signal;
  eventSignal: Signal;
  mapTriggerResetSignal: Signal;
  dc: dcSystem;
  currentMap: string = "";
  cnv: HTMLCanvasElement | undefined;
  ctx: CanvasRenderingContext2D | null = null;
  debug: boolean;

  public constructor(mapdata: any[], startingMap: string, debug: boolean) {
    super("collisiondetection");
    this.mapdata = mapdata;
    this.dc = new dcSystem();
    this.debug = debug;
    this.mapChange = new Signal("mapchange");
    this.mapChange.listen(this.mapchange);
    this.eventSignal = new Signal("mapEvent");
    this.mapTriggerResetSignal = new Signal("resetMapTrigger");
    this.mapTriggerResetSignal.listen(this.resetMapTrigger);
    this.currentMap = startingMap;
    this.loadWallsTriggers();
    UI.queue(() => {
      this.ctx = (this.cnv as HTMLCanvasElement).getContext("2d");
    });
  }

  mapchange(signalData: any) {
    console.log("mapchange", signalData.detail.params);
    //find new mapname in mapData
    const newmap = signalData.details[2];
    const mapIndex = this.mapdata.findIndex(map => map.name == newmap);
    if (mapIndex == -1) throw new Error("invalid map selected");

    this.currentMap = newmap;
    this.eraseEntityData();
    this.loadWallsTriggers();
  }

  resetMapTrigger = (signalData: any) => {
    let [id, mapName] = signalData.detail.params;
    if (mapName != this.currentMap) return;
    let entities = this.dc.all();
    //@ts-ignore
    let mapTrigger = entities.find(ent => ent.id == id);
    //@ts-ignore
    mapTrigger.actionStatus = "idle";
  };

  eraseEntityData() {
    this.dc.clear();
  }

  loadWallsTriggers() {
    const currentMapData = this.mapdata.find(map => map.name == this.currentMap);
    if (currentMapData == undefined) throw new Error("invalid map selected");

    currentMapData.walls.forEach((wall: { x: number; y: number; w: number; h: number }) => {
      this.dc.insert(this.createWallBody(new Vector(wall.x, wall.y), new Vector(wall.w, wall.h), this.currentMap));
    });
    currentMapData.triggers.forEach(
      (trigger: { x: number; y: number; w: number; h: number; actions: any[]; id: string; mode: string }) => {
        this.dc.insert(
          this.createTriggerBody(
            new Vector(trigger.x, trigger.y),
            new Vector(trigger.w, trigger.h),
            trigger.actions,
            this.currentMap,
            trigger.id,
            trigger.mode
          )
        );
      }
    );
  }

  createWallBody(position: Vector, size: Vector, map: string): any {
    return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
      type: "wall",
      level: 0,
      mask: [false, false, false, true, true],
      map: map,
    });
  }

  createTriggerBody(position: Vector, size: Vector, actions: any[], map: string, id: string, mode: string): any {
    return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
      type: "trigger",
      level: 1,
      mask: [false, false, false, true, true],
      actions: [...actions],
      map: map,
      actionStatus: "idle",
      id: id,
      mode: mode,
    });
  }

  loadEntities(entities: ColliderEntity[]) {
    entities.forEach(ent => {
      if (ent.collider != null) {
        this.dc.insert(ent.collider.colliderBody as Box);
      }
    });
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: ColliderEntity[]): void {
    //debug drawing to canvas
    if (this.ctx && this.cnv && this.debug) {
      this.ctx.clearRect(0, 0, this.cnv?.width, this.cnv?.height);
      this.ctx.strokeStyle = "#ff0000";
      this.ctx.beginPath();
      this.dc.draw(this.ctx);
      this.ctx.stroke();
    }

    entities.forEach(ent => (ent.collider.isColliding = new Vector(0, 0)));
    this.dc.checkAll((response: Response) => {
      const { a, b, overlapV } = response;

      if (a.type == "player" && b.type == "static")
        collisionResolution(a, b, entities, overlapV, response, collisionResolutionType.static);
      else if (b.type == "player" && a.type == "static")
        collisionResolution(b, a, entities, overlapV, response, collisionResolutionType.static);
      else if (a.type == "player" && b.type == "wall")
        collisionResolution(a, b, entities, overlapV, response, collisionResolutionType.wall);
      else if (b.type == "player" && a.type == "wall")
        collisionResolution(b, a, entities, overlapV, response, collisionResolutionType.wall);
      else if (a.type == "player" && b.type == "trigger")
        collisionResolution(a, b, entities, overlapV, response, collisionResolutionType.mapevent);
      else if (b.type == "player" && a.type == "trigger")
        collisionResolution(b, a, entities, overlapV, response, collisionResolutionType.mapevent);
      else if (a.type == "player" && b.type == "npc")
        collisionResolution(a, b, entities, overlapV, response, collisionResolutionType.npc);
      else if (b.type == "player" && a.type == "npc")
        collisionResolution(b, a, entities, overlapV, response, collisionResolutionType.npc);
    });
  }
}

const collisionResolution = (
  a: any,
  b: any,
  entities: ColliderEntity[],
  overlap: SAT.Vector,
  response: Response,
  method: collisionResolutionType
) => {
  if (!a || !b) return;
  let entityA;
  let entityB;
  let eventSignal = new Signal("Event");

  switch (method) {
    case collisionResolutionType.wall:
      entityA = entities.find(e => e.collider.colliderBody == a);
      if (entityA == undefined || !entityA.collider.colliderBody) return;
      entityA.position.x = entityA.position.x - overlap.x;
      entityA.position.y = entityA.position.y - overlap.y;
      entityA.collider.colliderBody.setPosition(
        entityA.collider.colliderBody.x - overlap.x,
        entityA.collider.colliderBody.y - overlap.y
      );
      break;
    case collisionResolutionType.static:
      entityA = entities.find(e => e.collider.colliderBody == a);
      if (entityA == undefined || !entityA.collider.colliderBody) return;
      entityA.position.x = entityA.position.x - overlap.x;
      entityA.position.y = entityA.position.y - overlap.y;

      entityA.collider.colliderBody.setPosition(
        entityA.collider.colliderBody.x - overlap.x,
        entityA.collider.colliderBody.y - overlap.y
      );
      break;
    case collisionResolutionType.npc:
      //@ts-ignore
      let npc: npcColliderBody | undefined = entities.find(e => e.collider.colliderBody == b);

      if (!npc) return;

      if (npc.velocity.x == 0 && npc.velocity.y == 0) {
        entityA = entities.find(e => e.collider.colliderBody == a);
        if (!entityA) return;

        //stop moving
        a.setPosition(a.x - overlap.x, a.y - overlap.y);
        entityA.position.x = entityA.position.x - overlap.x;
        entityA.position.y = entityA.position.y - overlap.y;
      } else if (npc.velocity.x != 0) {
        if (response.overlapN.x != 0) {
          entityB = entities.find(e => e.collider.colliderBody == b);
          if (!entityB) return;

          //stop moving
          b.setPosition(b.x + overlap.x, b.y + overlap.y);
          entityB.position.x = entityB.position.x + overlap.x;
          entityB.position.y = entityB.position.y + overlap.y;
        } else {
          entityA = entities.find(e => e.collider.colliderBody == a);
          if (!entityA) return;

          //stop moving
          a.setPosition(a.x - overlap.x, a.y - overlap.y);
          entityA.position.x = entityA.position.x - overlap.x;
          entityA.position.y = entityA.position.y - overlap.y;
        }
      } else if (npc.velocity.y != 0) {
        if (response.overlapN.y != 0) {
          entityB = entities.find(e => e.collider.colliderBody == b);
          if (!entityB) return;

          //stop moving
          b.setPosition(b.x + overlap.x, b.y + overlap.y);
          entityB.position.x = entityB.position.x + overlap.x;
          entityB.position.y = entityB.position.y + overlap.y;
        } else {
          entityA = entities.find(e => e.collider.colliderBody == a);
          if (!entityA) return;

          //stop moving
          a.setPosition(a.x - overlap.x, a.y - overlap.y);
          entityA.position.x = entityA.position.x - overlap.x;
          entityA.position.y = entityA.position.y - overlap.y;
        }
      }

      break;
    case collisionResolutionType.bounceback:
    case collisionResolutionType.destroy:
    case collisionResolutionType.push:
    case collisionResolutionType.mapevent:
      entityA = entities.find(e => e.collider.colliderBody == a);
      if (entityA == undefined || !entityA.collider.colliderBody) return;

      if (b.actionStatus == "idle") {
        console.log(b.mode);

        if (b.mode == "latch") b.actionStatus = "active";
        if (b.actions.length > 0) eventSignal.send([b.actions]);
      }

      break;
  }
};
