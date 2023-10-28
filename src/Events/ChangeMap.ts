import { Layer } from "@peasy-lib/peasy-viewport";
import { SceneManager } from "../../_Squeleto/Scene";
import { Signal } from "../../_Squeleto/Signals";
import { Vector } from "../../_Squeleto/Vector";
import { Entity } from "../../_Squeleto/entity";
import { GameEvent } from "../Systems/Events";

export class ChangeMap extends GameEvent {
  mapname: string = "";
  position: Vector = new Vector(0, 0);
  mapChangeSignal = new Signal("mapchange");
  resolution: ((value: void | PromiseLike<void>) => void) | undefined;
  layers: Layer[];

  constructor(who: Entity | string | null, params: [...any]) {
    super(who, params);
    this.event = "ChangeMap";
    this.mapname = params[0];
    this.position = params[1];
    this.mapChangeSignal.listen(this.maploaded);
    this.layers = SceneManager.viewport.layers;
  }

  maploaded = (signalData: CustomEvent) => {
    this.eventStatus = "complete";
    if (this.resolution) this.resolution();
  };

  static create(who: Entity | string | null, params: [...any]): ChangeMap {
    return new ChangeMap(who, params);
  }

  init(entities: Entity[]): Promise<void> {
    this.eventStatus = "running";
    return new Promise(resolve => {
      //change the map here

      //replace images in viewport layers
      //replace walls in collision system

      this.resolution = resolve;
    });
  }
}
