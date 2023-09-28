import { Vector } from "../../_Squeleto/Vector";
import { Component } from "../../_Squeleto/component";
import { Body, Box } from "detect-collisions";

// you can define the incoming types when the component is created
export interface IColliderComponent {
  data: {
    id: string;
    startingPosition: Vector;
    offset: Vector;
    size: Vector;
    layerMask: boolean[];
    layer: number;
  };
}
export type ColliderType = {
  id: string;
  layerAssignment: number;
  layers: boolean[];
  colliderBody: Body | undefined;
  offset: Vector;
};

// this is the exported interface that is used in systems modules
export interface ColliderComponent {
  collider: ColliderType;
}

export class ColliderComp extends Component {
  //setting default value
  public value: ColliderType = {
    id: "",
    layerAssignment: 0,
    layers: [],
    colliderBody: undefined,
    offset: new Vector(),
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
    this.value.layerAssignment = data.data.layer;
    this.value.layers = [...data.data.layerMask];
    this.value.offset = data.data.offset;
    console.log(data.data.startingPosition, data.data.offset);

    const entityposition = data.data.startingPosition.add(data.data.offset);

    console.log(entityposition);

    let thisEntity;
    switch (this.value.layerAssignment) {
      case 2: //static body
        thisEntity = createStaticBody(entityposition, data.data.size, this.value.id);
        break;
      case 3: //players
        thisEntity = createPlayableBody(entityposition, data.data.size, this.value.id);
        break;
      case 4: //npc
        thisEntity = createNPCBody(entityposition, data.data.size, this.value.id);
        break;
      default: //something else that shouldn't
        thisEntity = undefined;
        throw new Error("invalid layer assignement on entity");
    }
    this.value.colliderBody = thisEntity;
  }
}

function createPlayableBody(position: Vector, size: Vector, id: string) {
  return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, {}), {
    type: "player",
    id: id,
  });
}

function createStaticBody(position: Vector, size: Vector, id: string) {
  return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
    type: "static",
    id: id,
  });
}

function createNPCBody(position: Vector, size: Vector, id: string) {
  return Object.assign(new Box({ x: position.x, y: position.y }, size.x, size.y, { isStatic: true }), {
    type: "npc",
    id: id,
  });
}
