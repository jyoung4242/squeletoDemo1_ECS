import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { MapComponent } from "../Components/entitymap";
import { ZindexComponent } from "../Components/zindexComponent";
import { ColliderEntity } from "./collisionDetection";

export type RenderEntity = Entity & ZindexComponent & MapComponent & ColliderEntity;

export class RenderSystem extends System {
  currentMap: string = "";
  entities: RenderEntity[] = [];
  mapentities: RenderEntity[] = [];
  template: string = `
  < \${ entity === } \${ entity <=* mapentities }>
  `;
  public constructor(currentMap: string) {
    super("rendering");
    this.currentMap = currentMap;
  }

  public processEntity(entity: RenderEntity): boolean {
    return entity.zindex != null && entity.map == this.currentMap && entity.collider.colliderBody != undefined;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: RenderEntity[]): void {
    this.mapentities = entities.filter(ent => ent.map == this.currentMap);

    this.mapentities.forEach(entity => {
      if (!this.processEntity(entity)) return;
      entity.zindex = Math.floor((entity.position.y + entity.collider.offset.y) * 1000);
    });
  }
}
