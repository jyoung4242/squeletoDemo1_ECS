import { Signal } from "../../_Squeleto/Signals";
import { Entity } from "../../_Squeleto/entity";
import { GameEvent } from "../Systems/Events";

export class ResetMapEvent extends GameEvent {
  id: string = "";
  mapName: string = "";
  mapResetSignal = new Signal("resetMapTrigger");

  constructor(who: Entity | null, params: [...any]) {
    super(who, params);
    this.event = "ResetMapEvent";
    this.id = params[0];
    this.mapName = params[1];
  }

  static create(who: Entity | null, params: [...any]): ResetMapEvent {
    return new ResetMapEvent(who, params);
  }

  init(entities: Entity[]): Promise<void> {
    this.eventStatus = "running";
    return new Promise(resolve => {
      this.mapResetSignal.send([this.id, this.mapName]);
      this.eventStatus = "complete";
      resolve();
    });
  }
}
