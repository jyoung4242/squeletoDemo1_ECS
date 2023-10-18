import { Signal } from "../../_Squeleto/Signals";
import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { InteractionComponent } from "../Components/interactions";
import { StoryFlagSystem } from "./StoryFlags";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type InteractionEntity = Entity & InteractionComponent;

export class interactionSystem extends System {
  isCutscenePlaying: boolean = false;
  interactTrigger = new Signal("interact");
  sendEventSignal = new Signal("Event");
  isCutScenePlayingSignal = new Signal("cutscene");
  checkInteraction: boolean;
  public constructor() {
    super("interactions");
    this.checkInteraction = false;
    this.isCutScenePlayingSignal.listen((signalData: CustomEvent) => {
      this.isCutscenePlaying = signalData.detail.params[0];
      if (!this.isCutscenePlaying) this.checkInteraction = false;
    });
    this.interactTrigger.listen(() => {
      if (!this.checkInteraction) this.checkInteraction = true;
      console.log("setting check interaction flag");
    });
  }

  public processEntity(entity: InteractionEntity): boolean {
    // return the test to determine if the entity has the correct properties
    return entity.interactions.isEnabled;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: InteractionEntity[]): void {
    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }

      if (this.isCutscenePlaying) return;

      if (this.checkInteraction && entity.interactions && entity.interactions.isActive) {
        let actions = entity.interactions.actions;
        console.log("in check interaction");

        for (let action of actions) {
          //this is the conditional check of
          if (action.condition) {
            console.log("inside storyflag check");

            this.sendEventSignal.send([action.actions]);
            return;
          }
        }
      }
    });
  }
}
