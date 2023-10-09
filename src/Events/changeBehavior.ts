import { Entity } from "../../_Squeleto/entity";
import { EventComponent } from "../Components/events";
import { GameEvent } from "../Systems/Events";

export class ChangeBehaviorEvent extends GameEvent {
  behavior: string = "";
  target: string = "";

  constructor(who: Entity | null, params: [...any]) {
    super(who, params);
    this.event = "ChangeBehaviorEvent";
    this.target = params[0];
    this.behavior = params[1];
  }

  static create(who: Entity | null, params: [...any]): ChangeBehaviorEvent {
    return new ChangeBehaviorEvent(who, params);
  }

  init(entities: Entity[]): Promise<void> {
    console.log("init changebehavior");

    this.eventStatus = "running";
    return new Promise(resolve => {
      if (this.target) {
        console.log(this.target);
        //get entity of name
        //@ts-ignore
        let targetEntity: Entity & EventComponent = entities.find(trg => trg.name == this.target);
        targetEntity.behaviors.behaviorIndex = 0;
        targetEntity.behaviors.currentBehavior = this.behavior;
      }

      this.eventStatus = "complete";
      resolve();
    });
  }
}
