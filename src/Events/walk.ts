import { GameEvent } from "../Systems/Events";
import { Entity } from "../../_Squeleto/entity";
import { Vector } from "../../_Squeleto/Vector";
import { VelocityComponent } from "../Components/velocity";
import { SpriteSheetComponent } from "../Components/spritesheet";
import { PositionComponent } from "../Components/positionComponent";
export type direction = "right" | "left" | "up" | "down";

export class WalkEvent extends GameEvent {
  direction: direction;
  who: (Entity & VelocityComponent & SpriteSheetComponent & PositionComponent) | null;
  targetValue: number = 0;
  distance: number;
  speed: number;
  resolution: ((value: void | PromiseLike<void>) => void) | undefined;

  constructor(who: (Entity & VelocityComponent & SpriteSheetComponent & PositionComponent) | null, params: [...any]) {
    super(who, params);
    this.who = who;
    this.direction = params[0];
    this.distance = params[1];
    this.speed = params[2];
  }

  update(): void {
    if (this.who) {
      switch (this.direction) {
        case "right":
          if (this.who.position.x >= this.targetValue) {
            if (this.resolution) this.resolution();
            this.eventStatus = "complete";
            this.who.velocity = new Vector(0, 0);
            this.who.spritesheet[1].currentSequence = `idle-${this.direction}`;
          }
          break;
        case "left":
          if (this.who.position.x <= this.targetValue) {
            if (this.resolution) this.resolution();
            this.eventStatus = "complete";
            this.who.velocity = new Vector(0, 0);
            this.who.spritesheet[1].currentSequence = `idle-${this.direction}`;
          }
          break;
        case "up":
          if (this.who.position.y <= this.targetValue) {
            if (this.resolution) this.resolution();
            this.eventStatus = "complete";
            this.who.velocity = new Vector(0, 0);
            this.who.spritesheet[1].currentSequence = `idle-${this.direction}`;
          }
          break;
        case "down":
          if (this.who.position.y >= this.targetValue) {
            if (this.resolution) this.resolution();
            this.eventStatus = "complete";
            this.who.velocity = new Vector(0, 0);
            this.who.spritesheet[1].currentSequence = `idle-${this.direction}`;
          }
          break;
      }
    }
  }

  init(): Promise<void> {
    this.eventStatus = "running";

    return new Promise(resolve => {
      this.resolution = resolve;
      if (this.who)
        switch (this.direction) {
          case "right":
            this.who.velocity = new Vector(this.speed, 0);
            this.who.spritesheet[1].currentSequence = "walk-right";
            this.targetValue = this.who.position.x + this.distance;
            break;
          case "left":
            this.who.velocity = new Vector(-this.speed, 0);
            this.who.spritesheet[1].currentSequence = "walk-left";
            this.targetValue = this.who.position.x - this.distance;
            break;
          case "up":
            this.who.velocity = new Vector(0, -this.speed);
            this.who.spritesheet[1].currentSequence = "walk-up";
            this.targetValue = this.who.position.y - this.distance;
            break;
          case "down":
            this.who.velocity = new Vector(0, this.speed);
            this.who.spritesheet[1].currentSequence = "walk-down";
            this.targetValue = this.who.position.y + this.distance;
            break;
        }
    });
  }
}
