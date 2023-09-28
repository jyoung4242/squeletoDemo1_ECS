import { Component } from "../../_Squeleto/component";

// you can define the incoming types when the component is created
export interface ICameraFollowComponent {
  data: CameraFollowType;
}
export type CameraFollowType = boolean;

// this is the exported interface that is used in systems modules
export interface CameraFollowComponent {
  camerafollow: CameraFollowType;
}

// classes should have:
// if UI element, a template property with the peasy-ui template literal
// if no UI aspect to the system, do not define a template
// a 'value' property that will be attached to the entity
export class CameraFollowComp extends Component {
  //setting default value
  public value: CameraFollowType = false;
  public constructor() {
    //@ts-ignore
    super("camerafollow", CameraFollowComp, true);
  }

  public define(data: ICameraFollowComponent): void {
    if (data == null) {
      return;
    }
    this.value = data.data;
  }
}
