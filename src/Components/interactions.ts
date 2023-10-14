import { Component } from "../../_Squeleto/component";
import { GameEvent } from "../Systems/Events";

// you can define the incoming types when the component is created
export interface IInteractionComponent {
  data: InteractionType;
}

type conditionalAction = {
  condition: any;
  actions: GameEvent[];
};

export type InteractionType = {
  isEnabled: boolean;
  isActive: boolean;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  blurradius: number;
  radius: string;
  blur: number;
  actions: conditionalAction[];
};

// this is the exported interface that is used in systems modules
export interface InteractionComponent {
  interactions: InteractionType;
}

export class InteractionComp extends Component {
  template = `

<interaction-object style="
    display: block;
    position: absolute;
    width:\${value.w}px;
    height:\${value.h}px;
    top:\${value.y}px;
    left:\${value.x}px;
    box-shadow: 0px 0px \${value.blur}px \${value.blurradius}px \${value.color};
    border: 1px solid transparent;
    border-radius: \${value.radius};
    ">
</interaction-object>
`;

  public value: InteractionType = {
    isEnabled: false,
    isActive: false,
    color: "",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    blurradius: 0,
    radius: "",
    blur: 0,
    actions: [],
  };
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
