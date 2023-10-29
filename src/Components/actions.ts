import { Component } from "../../_Squeleto/component";

// you can define the incoming types when the component is created
export interface IactionComponent {
  data: Array<string>;
}
export type actionType = {
  current: string;
  available: Array<string>;
};

// this is the exported interface that is used in systems modules
export interface actionComponent {
  actions: actionType;
}

export class ActionComp extends Component {
  // UI action string literal with UI binding of value property
  //setting default value
  public value: actionType = {
    current: "",
    available: [],
  };
  public constructor() {
    //@ts-ignore
    super("actions", ActionComp, true);
  }

  public define(data: IactionComponent): void {
    if (data == null) {
      return;
    }

    this.value.available = data.data;
    this.value.current = data.data[0];
  }
}
