import { GameEvent } from "../Systems/Events";
import { Entity } from "../../_Squeleto/entity";
import { MapComponent } from "../Components/entitymap";
import { PositionComponent } from "../Components/positionComponent";
import { Vector } from "../../_Squeleto/Vector";

/**
 * This is a event for the asynchronous changing of the maps
 * for npc's, which is different than the default mapchange
 * which changes the rendered map, this allows NPC's to leave
 * one map and move to another, but doesn't touch what's rendered
 */

export class ChangeMap extends GameEvent {
  /*  who: (Entity & MapComponent & PositionComponent) | undefined;
  newMap: string;
  newX: number;
  newY: number;

  constructor(who: (Entity & MapComponent & PositionComponent) | undefined, mapname: string, x: number, y: number) {
    super("MapChange");
    this.who = who;
    this.newMap = mapname;
    this.newX = x;
    this.newY = y;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      (this.who as Entity & MapComponent & PositionComponent).map = this.newMap;
      (this.who as Entity & MapComponent & PositionComponent).position = new Vector(this.newX, this.newY);

      resolve();
    });
  } */
}
