import { Signal } from "../../_Squeleto/Signals";
import { Entity } from "../../_Squeleto/entity";
import { GameEvent } from "../Systems/Events";
import { v4 as uuid4 } from "uuid";

export class DialogEvent extends GameEvent {
  endSignal: Signal = new Signal("dialogComplete");
  startSignal: Signal = new Signal("dialog");
  confirmSignal: Signal = new Signal("confirm");
  isSimpleDialog: boolean = true;
  payload: string | object;
  id = uuid4();
  resolution: ((value: void | PromiseLike<void>) => void) | undefined;

  constructor(who: Entity | string | null, params: [...any]) {
    super(who, params);
    this.event = "DialogEvent";
    this.payload = params[0];

    if (typeof this.payload == "string") this.isSimpleDialog = true;
    else if (typeof this.payload == "object") this.isSimpleDialog = false;
    else throw new Error("invalid Dialog Event parameter");
    this.endSignal.listen(this.endDialog);
    this.confirmSignal.listen(this.confirmPressed);
  }

  confirmPressed = () => {
    //console.log("confirm triggered");

    if (this.eventStatus == "running") {
      this.eventStatus = "complete";
      if (this.resolution) this.resolution();
    }
  };

  endDialog = (signalData: CustomEvent) => {
    //console.log("got end signal");
    const signalID = signalData.detail.params[0];
    if (this.id == signalID) {
      this.eventStatus = "complete";
      if (this.resolution) this.resolution();
    }
  };

  static create(who: Entity | string | null, params: [...any]): DialogEvent {
    return new DialogEvent(who, params);
  }

  init(entities: Entity[]): Promise<void> {
    this.eventStatus = "running";

    return new Promise(resolve => {
      //do something
      let dialogConfig = {};
      console.log(this.isSimpleDialog);

      if (this.isSimpleDialog) {
        dialogConfig = {
          id: this.id,
          buttonContent: "END",
          template: "basic",
          content: this.payload,
          showButton: true,
        };
      } else {
        Object.assign(dialogConfig, this.payload, { id: this.id });
      }
      this.startSignal.send([dialogConfig]);
      this.resolution = resolve;
    });
  }
}
