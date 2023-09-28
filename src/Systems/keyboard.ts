import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { KeyboardComponent } from "../Components/keyboard";
import { Input } from "@peasy-lib/peasy-input";
import { VelocityComponent } from "../Components/velocity";
import { Vector } from "../../_Squeleto/Vector";
import { animatedSpriteEntity } from "./animatedSprite";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type KeyboardEntity = Entity & KeyboardComponent & VelocityComponent & animatedSpriteEntity;

export class KeyboardSystem extends System {
  direction: "right" | "left" | "up" | "down" = "down";
  state: "idle" | "walk" = "idle";
  leftDown: boolean = false;
  rightDown: boolean = false;
  upDown: boolean = false;
  downDown: boolean = false;

  template = ``;
  public constructor() {
    super("keyboard");

    //Map your bindings here
    Input.map(
      {
        ArrowLeft: "walk_left",
        ArrowRight: "walk_right",
        ArrowDown: "walk_down",
        ArrowUp: "walk_up",
      },
      (action: string, doing: boolean) => {
        if (doing) {
          switch (action) {
            case "walk_left":
              this.direction = "left";
              this.state = "walk";
              this.leftDown = true;
              break;
            case "walk_right":
              this.direction = "right";
              this.state = "walk";
              this.rightDown = true;
              break;
            case "walk_down":
              this.direction = "down";
              this.state = "walk";
              this.downDown = true;
              break;
            case "walk_up":
              this.direction = "up";
              this.state = "walk";
              this.upDown = true;
              break;
          }
        } else {
          switch (action) {
            case "walk_left":
              this.leftDown = false;
              break;
            case "walk_right":
              this.rightDown = false;
              break;
            case "walk_down":
              this.downDown = false;
              break;
            case "walk_up":
              this.upDown = false;
              break;
          }
          if (!this.leftDown && !this.rightDown && !this.upDown && !this.downDown) {
            this.state = "idle";
          }
        }
      }
    );
  }

  public processEntity(entity: KeyboardEntity): boolean {
    // return the test to determine if the entity has the correct properties
    return entity.keyboard != null && entity.velocity != null && entity.spritesheet != null;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: KeyboardEntity[]): void {
    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }
      Input.update(deltaTime);
      entity.keyboard.direction = this.direction;
      entity.keyboard.state = this.state;

      if (entity.keyboard.state == "idle") {
        entity.velocity = new Vector(0, 0);
        return;
      }
      switch (this.direction) {
        case "down":
          entity.velocity = new Vector(0, 1);
          break;
        case "up":
          entity.velocity = new Vector(0, -1);
          break;
        case "left":
          entity.velocity = new Vector(-1, 0);
          break;
        case "right":
          entity.velocity = new Vector(1, 0);
          break;
      }
    });
  }
}
