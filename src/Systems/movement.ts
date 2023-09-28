import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { ColliderComponent } from "../Components/collider";
import { PositionComponent } from "../Components/positionComponent";
import { VelocityComponent } from "../Components/velocity";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type MovementEntity = Entity & PositionComponent & VelocityComponent & ColliderComponent;

export class MovementSystem extends System {
  template = ``;
  public constructor() {
    super("movement");
  }

  public processEntity(entity: MovementEntity): boolean {
    // return the test to determine if the entity has the correct properties
    return entity.position != null && entity.velocity != null;
    // entities that have position and velocity properties can use this system
    return true;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: MovementEntity[]): void {
    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }

      entity.position = entity.position.add(entity.velocity);
      const cboyPosition = entity.position.add(entity.collider.offset);
      entity.collider.colliderBody?.setPosition(cboyPosition.x, cboyPosition.y);
    });
  }
}
