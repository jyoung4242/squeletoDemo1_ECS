import { Component } from "../../_Squeleto/component";
import { GameEvent } from "../Systems/Events";

// you can define the incoming types when the component is created
export interface IInteractionComponent {
  data: InteractionType;
}
export type Interaction = {};
export type InteractionType = {
  conditions: Record<string, any>;
  actions: GameEvent[];
}[];

// this is the exported interface that is used in systems modules
export interface InteractionComponent {
  interactions: InteractionType;
}

export class InteractionComp extends Component {
  public value: InteractionType = [];
  public constructor() {
    //@ts-ignore
    super("interactions", InteractionComp, true);
  }

  public define(data: IInteractionComponent): void {
    if (data == null) {
      return;
    }
    this.value = data.data;
  }
}
