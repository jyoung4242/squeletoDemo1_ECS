import { Entity } from "../../_Squeleto/entity";
import { GameEvent } from "../Systems/Events";
import { StoryFlagSystem } from "../Systems/StoryFlags";

export class StoryFlagEvent extends GameEvent {
  flagName: string = "";
  value: any;

  constructor(who: Entity | string | null, params: [...any]) {
    super(who, params);
    this.event = "StoryFlag";
    this.flagName = params[0];
    this.value = params[1];
  }

  static create(who: Entity | string | null, params: [...any]): StoryFlagEvent {
    return new StoryFlagEvent(who, params);
  }

  init(entities: Entity[]): Promise<void> {
    this.eventStatus = "running";
    return new Promise(resolve => {
      StoryFlagSystem.setStoryFlagValue(this.flagName, this.value);
      this.eventStatus = "complete";
      resolve();
    });
  }
}
