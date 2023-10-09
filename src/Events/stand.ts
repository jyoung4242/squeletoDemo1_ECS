import { GameEvent } from "../Systems/Events";
import { Entity } from "../../_Squeleto/entity";
import { Signal } from "../../_Squeleto/Signals";
import { SpriteSheetComponent } from "../Components/spritesheet";
import { direction } from "./walk";

/**
 * This is a event for the asynchronous 'standing' of the player or NPC
 * this event engages a native 'startBehavior' method of the GameObject
 * and passes the 'stand' string as the behavior parameter, and a duration number (milliseconds)
 * this resolves from a Signal from the gameobject that the 'standCompleted'
 * has been completed
 */

export class StandEvent extends GameEvent {
  direction: direction;
  duration: number;

  constructor(who: Entity | null, params: [...any]) {
    super(who, params);
    this.direction = params[0];
    this.duration = params[1];
  }

  init(): Promise<void> {
    this.eventStatus = "running";
    return new Promise(resolve => {
      if (this.who && Object.hasOwn(this.who, "spritesheet")) {
        //@ts-ignore
        this.who.spritesheet[1].currentSequence = `idle-${this.direction}`;
      }

      setTimeout(() => {
        this.eventStatus = "complete";
        resolve();
      }, this.duration);
    });
  }
}
