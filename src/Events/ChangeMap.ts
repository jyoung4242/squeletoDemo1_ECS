import { Layer } from "@peasy-lib/peasy-viewport";
import { Scene, SceneManager } from "../../_Squeleto/Scene";
import { Signal } from "../../_Squeleto/Signals";
import { Vector } from "../../_Squeleto/Vector";
import { Entity } from "../../_Squeleto/entity";
import { GameEvent } from "../Systems/Events";
import { PositionComponent } from "../Components/positionComponent";
import { VelocityComponent } from "../Components/velocity";
import { ColliderComponent } from "../Components/collider";
import { KeyboardComponent } from "../Components/keyboard";
import { NameComponent } from "../Components/name";
import { Kitchen } from "../Maps/kitchen";
import { OutsideMap } from "../Maps/outside";
import { Assets } from "@peasy-lib/peasy-assets";
import { RenderComponent } from "../Components/render";
import { MapComponent } from "../Components/entitymap";

type MovementEntity = Entity &
  PositionComponent &
  VelocityComponent &
  ColliderComponent &
  KeyboardComponent &
  NameComponent &
  RenderComponent &
  MapComponent;

export class ChangeMap extends GameEvent {
  mapname: string = "";
  position: Vector = new Vector(0, 0);
  mapChangeSignal = new Signal("mapchange");
  resolution: ((value: void | PromiseLike<void>) => void) | undefined;
  layers: Layer[] | undefined;
  mapdata: any[] = [];

  constructor(who: Entity | string | null, params: [...any]) {
    super(who, params);
    this.event = "ChangeMap";
    this.mapname = params[0];
    this.position = params[1];
    this.mapChangeSignal.listen(this.maploaded);
  }

  maploaded = (signalData: CustomEvent) => {
    this.eventStatus = "complete";
    if (this.resolution) this.resolution();
  };

  static create(who: Entity | string | null, params: [...any]): ChangeMap {
    return new ChangeMap(who, params);
  }
  // Function to animate fading in
  private fadeIn(element: HTMLElement, duration: number) {
    return element?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: duration,
      easing: "ease-in-out",
      fill: "forwards",
    }).finished;
  }

  // Function to animate fading in
  private fadeOut(element: HTMLElement, duration: number) {
    return element?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: duration,
      easing: "ease-in-out",
      fill: "forwards",
    }).finished;
  }

  init(entities: Entity[]): Promise<void> {
    this.eventStatus = "running";

    this.layers = SceneManager.viewport.layers;
    this.mapdata = [Kitchen, OutsideMap];

    return new Promise(async resolve => {
      //replace images in viewport layers
      let layers = SceneManager.viewport.layers;
      let upper = layers.find(lyr => lyr.name == "mapupper");
      let lower = layers.find(lyr => lyr.name == "maplower");
      let dialog = layers.find(lyr => lyr.name == "dialog");

      //show the transition cover
      const fade = SceneManager.viewport.addLayers({ name: "transition", before: dialog } as any)[0];
      await this.fadeIn(fade.element as HTMLElement, 300);

      //move hero
      let hero = (entities as MovementEntity[]).find(ent => ent.name == "hero");
      if (hero) {
        hero.position.x = this.position.x;
        hero.position.y = this.position.y;
        hero.map = this.mapname;
        hero.collider.map = this.mapname;
      }

      //find map data
      let newmap = this.mapdata.find(mp => mp.name == this.mapname);
      let newwidth = newmap.width;
      let newheight = newmap.height;

      if (upper && lower && upper.element && lower.element && newmap) {
        (upper.element.children[0] as HTMLImageElement).style.backgroundImage = `url(${Assets.image(newmap.upper).src})`;
        (upper.element.children[0] as HTMLImageElement).style.width = `${newwidth}px`;
        (upper.element.children[0] as HTMLImageElement).style.height = `${newheight}px`;
        (lower.element.children[0] as HTMLImageElement).style.backgroundImage = `url(${Assets.image(newmap.lower).src})`;
        (lower.element.children[0] as HTMLImageElement).style.width = `${newwidth}px`;
        (lower.element.children[0] as HTMLImageElement).style.height = `${newheight}px`;
      }
      SceneManager.viewport.update();
      //send signal to collision system for walls and triggers
      this.mapChangeSignal.send([this.mapname, this.position]);
      this.eventStatus = "complete";
      await this.fadeOut(fade.element as HTMLElement, 300);
      SceneManager.viewport.removeLayers(fade);
      resolve();
    });
  }
}
