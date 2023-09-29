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
import { map, over } from "lodash";
import { MapComponent } from "../Components/entitymap";
// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type ColliderEntity = Entity & ColliderComponent & SizeComponent & PositionComponent & MapComponent;

export type colliderBody = Box & { type: string; layerAssignment: number; layers: boolean[]; map: "" };

export class CollisionDetectionSystem extends System {
  template: string = `
  <canvas id="dc" width="400" height="225" \${==>cnv}></canvas>
  `;
  mapdata: any[];
  entities: ColliderEntity[] = [];
  mapChange: Signal;
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
    this.currentMap = startingMap;
    this.loadWallsTriggers();
    UI.queue(() => {
      this.ctx = (this.cnv as HTMLCanvasElement).getContext("2d");
    });
  }

  mapchange(signalData: any) {
    console.log("mapchange", signalData.details.params);
    //find new mapname in mapData
    const newmap = signalData.details[2];
    const mapIndex = this.mapdata.findIndex(map => map.name == newmap);
    if (mapIndex == -1) throw new Error("invalid map selected");

    this.currentMap = newmap;
    this.eraseEntityData();
    this.loadWallsTriggers();
  }

  eraseEntityData() {
    this.dc.clear();
  }

  loadWallsTriggers() {
    const currentMapData = this.mapdata.find(map => map.name == this.currentMap);
    if (currentMapData == undefined) throw new Error("invalid map selected");

    currentMapData.walls.forEach((wall: { x: number; y: number; w: number; h: number }) => {
      this.dc.insert(this.createWallBody(new Vector(wall.x, wall.y), new Vector(wall.w, wall.h), this.currentMap));
    });
    currentMapData.triggers.forEach((trigger: { x: number; y: number; w: number; h: number; actions: any[] }) => {
      this.dc.insert(
        this.createTriggerBody(new Vector(trigger.x, trigger.y), new Vector(trigger.w, trigger.h), trigger.actions, this.currentMap)
      );
    });
  }

  createWallBody(position: Vector, size: Vector, map: string): any {
    return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
      type: "wall",
      level: 0,
      mask: [false, false, false, true, true],
      map: map,
    });
  }

  createTriggerBody(position: Vector, size: Vector, actions: any[], map: string): any {
    return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
      type: "trigger",
      level: 1,
      mask: [false, false, false, true, true],
      actions: [...actions],
      map: map,
    });
  }

  loadEntities(entities: ColliderEntity[]) {
    //TODO- need to add current map to this so only entities in current map are considered
    console.log(entities);

    entities.forEach(ent => {
      if (ent.collider != null) {
        this.dc.insert(ent.collider.colliderBody as Box);
      }
    });
    console.log(this.dc);
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

    this.dc.checkAll((response: Response) => {
      const { a, b, overlapV } = response;

      if (a.type == "player") {
        //get a parent
        const parent = entities.find(ent => ent.id == a.id);

        if (parent) {
          if (b.type == "wall" && b.map == parent.map) {
            response.a.setPosition(response.a.x - overlapV.x, response.a.y - overlapV.y);
            parent.position = parent?.position.subtract(new Vector(overlapV.x, overlapV.y));
          } else if (b.type == "static" && b.map == parent.map) {
            response.a.setPosition(response.a.x - overlapV.x, response.a.y - overlapV.y);
            parent.position = parent?.position.subtract(new Vector(overlapV.x, overlapV.y));
          } else if (b.type == "npc" && b.map == parent.map) {
            response.a.setPosition(response.a.x - overlapV.x, response.a.y - overlapV.y);
            parent.position = parent?.position.subtract(new Vector(overlapV.x, overlapV.y));
          }
        }
      }
    });
  }
}
