import { SceneManager } from "../../_Squeleto/Scene";
import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { CameraFollowComponent } from "../Components/cameraFollow";
import { PositionComponent } from "../Components/positionComponent";
import { SizeComponent } from "../Components/sizeComponent";

const lerpRate = 0.1;

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type CameraFollowEntity = Entity & CameraFollowComponent & PositionComponent & SizeComponent;

export class CameraFollowSystem extends System {
  template = ``;
  public constructor() {
    super("cameraFollow");
  }

  public processEntity(entity: CameraFollowEntity): boolean {
    return entity.camerafollow == true && entity.position != null && entity.size != null;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: CameraFollowEntity[]): void {
    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }

      this.cameraLerp(entity);
    });
  }

  cameraLerp(entity: CameraFollowEntity) {
    let offsetX = 0; //SceneManager.viewport.size.x / 2;
    let offsetY = 0; //SceneManager.viewport.size.y / 2;
    SceneManager.viewport.camera.x = entity.position.x - offsetX + entity.size.x / 2;
    SceneManager.viewport.camera.y = entity.position.y - offsetY + entity.size.y / 2;

    SceneManager.viewport.update();
  }
}
