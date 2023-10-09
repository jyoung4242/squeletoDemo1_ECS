import { Vector } from "../../_Squeleto/Vector";
import { Component } from "../../_Squeleto/component";
import { Body, Box } from "detect-collisions";

// you can define the incoming types when the component is created
export interface IColliderComponent {
  data: {
    type: string;
    id: string;
    startingPosition: Vector;
    offset: Vector;
    size: Vector;
    map: string;
  };
}
export type ColliderType = {
  isColliding: Vector;
  id: string;
  colliderBody: Body | undefined;
  offset: Vector;
  map: string;
};

// this is the exported interface that is used in systems modules
export interface ColliderComponent {
  collider: ColliderType;
}

export class ColliderComp extends Component {
  //setting default value
  public value: ColliderType = {
    isColliding: new Vector(0, 0),
    id: "",
    colliderBody: undefined,
    offset: new Vector(),
    map: "",
  };
  public constructor() {
    //@ts-ignore
    super("collider", ColliderComp, true);
  }

  public define(data: IColliderComponent): void {
    if (data == null) {
      return;
    }
    this.value.id = data.data.id;

    this.value.offset = data.data.offset;
    console.log(data.data.startingPosition, data.data.offset);

    const entityposition = data.data.startingPosition.add(data.data.offset);

    console.log(entityposition);

    let thisEntity;
    switch (data.data.type) {
      case "static": //static body
        thisEntity = createStaticBody(entityposition, data.data.size, this.value.id, data.data.map);
        break;
      case "players": //players
        thisEntity = createPlayableBody(entityposition, data.data.size, this.value.id, data.data.map);
        break;
      case "npc": //npc
        thisEntity = createNPCBody(entityposition, data.data.size, this.value.id, data.data.map);
        break;
      default: //something else that shouldn't
        thisEntity = undefined;
        throw new Error("invalid layer assignement on entity");
    }
    this.value.colliderBody = thisEntity;
  }
}

function createPlayableBody(position: Vector, size: Vector, id: string, map: string) {
  return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, {}), {
    type: "player",
    id: id,
    map: map,
  });
}

function createStaticBody(position: Vector, size: Vector, id: string, map: string) {
  return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
    type: "static",
    id: id,
    map: map,
  });
}

function createNPCBody(position: Vector, size: Vector, id: string, map: string) {
  return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, {}), {
    type: "npc",
    id: id,
    map: map,
  });
}
