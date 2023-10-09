import { Signal } from "../../_Squeleto/Signals";
import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { EventComponent } from "../Components/events";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type EventEntity = Entity & EventComponent;

export class EventSystem extends System {
  EventSignal: Signal;
  cutSceneSignal: Signal;
  isCutsceneRunning: boolean = false;
  isBehaviorEventActive: boolean = false;
  cutsceneSequence: GameEvent[] = [];
  cutsceneIndex: number = 0;
  cutsceneCurrentEvent: GameEvent | undefined = undefined;

  constructor() {
    super("Events");
    this.EventSignal = new Signal("Event");
    this.EventSignal.listen(this.runCutscene);
    this.cutSceneSignal = new Signal("cutscene");
  }

  processEntity(entity: EventEntity): boolean {
    return entity.behaviors != null;
  }

  runCutscene = (SignalData: CustomEvent) => {
    this.cutsceneIndex = 0;
    this.cutsceneSequence = [...SignalData.detail.params[0]];
    this.isCutsceneRunning = true;
  };

  // update routine that is called by the gameloop engine
  update = (deltaTime: number, now: number, entities: EventEntity[]): void => {
    if (!this.isCutsceneRunning || this.isBehaviorEventActive) {
      //THIS IS THE BEHAVIOR LOOPS
      entities.forEach(entity => {
        if (!this.processEntity(entity)) return;

        let { currentBehavior, behaviorIndex, behaviors, currentEvent } = entity.behaviors;

        //@ts-ignore

        if (currentEvent == undefined) {
          //setup current Event
          const params = behaviors[currentBehavior][behaviorIndex][1];
          entity.behaviors.currentEvent = new behaviors[currentBehavior][behaviorIndex][0](entity, [...params]);
        }

        currentEvent = entity.behaviors.currentEvent;
        if (currentEvent == undefined) return;
        if (currentEvent.eventStatus == "idle") {
          currentEvent.init(entities);
          this.isBehaviorEventActive = true;
          return;
        } else if (currentEvent.eventStatus == "running") {
          currentEvent.update();
          return;
        } else if (currentEvent.eventStatus == "complete") {
          currentEvent.reset();
          this.isBehaviorEventActive = false;

          entity.behaviors.behaviorIndex++;
          entity.behaviors.currentEvent = undefined;
          if (entity.behaviors.behaviorIndex >= behaviors[currentBehavior].length) {
            entity.behaviors.behaviorIndex = 0;
          }
          return;
        }
      });
    } else {
      //@ts-ignore
      if (this.cutsceneCurrentEvent == undefined) {
        //setup current Event

        this.cutsceneCurrentEvent = this.cutsceneSequence[this.cutsceneIndex];
        //console.log("setting event", this.cutsceneCurrentEvent);
      }

      if (this.cutsceneCurrentEvent == undefined) return;
      //console.log(this.cutsceneCurrentEvent);

      if (this.cutsceneCurrentEvent.eventStatus == "idle") {
        this.cutsceneCurrentEvent.init(entities);
        //console.log("cutscene init");

        return;
      } else if (this.cutsceneCurrentEvent.eventStatus == "running") {
        this.cutsceneCurrentEvent.update();
        //console.log("cutscene running");
        return;
      } else if (this.cutsceneCurrentEvent.eventStatus == "complete") {
        //console.log("cutscene complete");
        this.cutsceneCurrentEvent.reset();

        this.cutsceneIndex++;
        this.cutsceneCurrentEvent = undefined;

        if (this.cutsceneIndex >= this.cutsceneSequence.length) {
          this.cutsceneIndex = 0;
          this.isCutsceneRunning = false;
          this.cutsceneSequence = [];
          //console.log("ending cutscene");
        }
        return;
      }
    }
  };
}

export class GameEvent {
  eventStatus: "idle" | "running" | "complete";
  who: Entity | null = null;
  event: string = "event";

  constructor(who: Entity | null, params: [...any]) {
    this.who = who;
    this.eventStatus = "idle";
  }

  init(entities?: Entity[]): Promise<void> {
    return new Promise(resolve => {
      //do eventcode here
      resolve();
    });
  }

  reset() {
    this.eventStatus = "idle";
  }

  update() {}

  static create(who: Entity | null, params: [...any]): GameEvent {
    return new GameEvent(who, params);
  }
}
