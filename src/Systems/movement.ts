import { Signal } from "../../_Squeleto/Signals";
import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { ColliderComponent } from "../Components/collider";
import { PositionComponent } from "../Components/positionComponent";
import { VelocityComponent } from "../Components/velocity";
import { KeyboardComponent } from "../Components/keyboard";
import { direction } from "../Events/walk";
import { Vector } from "../../_Squeleto/Vector";
import { LogEvent } from "../Events/log";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type MovementEntity = Entity & PositionComponent & VelocityComponent & ColliderComponent & KeyboardComponent;

export class MovementSystem extends System {
  isCutscenePlaying: boolean = false;
  cutsceneSignal: Signal = new Signal("cutscene");
  //moveSignal: Signal;
  template = ``;
  public constructor() {
    super("movement");
    //this.moveSignal = new Signal("moved");
    this.cutsceneSignal.listen((signalData: CustomEvent) => {
      this.isCutscenePlaying = signalData.detail.params[0];
    });
  }

  public processEntity(entity: MovementEntity): boolean {
    // return the test to determine if the entity has the correct properties
    return entity.position != null && entity.velocity != null;
    // entities that have position and velocity properties can use this system
    return true;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: MovementEntity[]): void {
    if (this.isCutscenePlaying) return;
    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }

      let normalizedCollision: Vector;
      let adjustedVelocity: Vector;
      if (!entity.collider.isColliding.zero) {
        normalizedCollision = entity.collider.isColliding.multiply(entity.velocity);
        adjustedVelocity = entity.velocity.add(normalizedCollision);
      } else {
        adjustedVelocity = entity.velocity;
      }

      if (!adjustedVelocity.zero) {
        entity.position = entity.position.add(entity.velocity);
        const cboyPosition = entity.position.add(entity.collider.offset);
        entity.collider.colliderBody?.setPosition(cboyPosition.x, cboyPosition.y);
        if (entity.collider.interactor?.body)
          entity.collider.interactor?.body.setPosition(
            entity.position.x + entity.collider.interactor.offset.x,
            entity.position.y + entity.collider.interactor.offset.y
          );
        //this.moveSignal.send([entity.id, entity.velocity.magnitude]);
      }
    });
  }

  isPathClear(entity: MovementEntity, entities: MovementEntity[], directionVector: Vector, proximityMagnitude: number): boolean {
    //get list of entities that are close to Entity by distance
    const closeEntities = entities.filter((ent: MovementEntity) => {
      if (ent == entity) return false;
      const distance = ent.position.subtract(entity.position).magnitude;
      return distance < proximityMagnitude;
    });
    //for each close entity, get compare direction vector to
    return true;
  }
}
