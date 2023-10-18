import { Signal } from "../../_Squeleto/Signals";
import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { DialogEvent } from "../Events/dialogEvent";

type DialogEntity = Entity;

export class DialogSystem extends System {
  template: string = `


  <style>
  
  dialog-container{
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      opacity: 1;
      transition: opacity 0.2s;
  }
  dialog-container.pui-adding,
  dialog-container.pui-removing{
      opacity: 0;
  }

  dialog-inner{
      padding: 0px;
      position: absolute;
      background-color: AntiqueWhite;
      color: Navy;
      inset: 75% 0 0 0;
      height: var(--dialogue-ht, 25%);
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(14, 1fr);
      gap: 2px;
      grid-template-areas: \${dm.gridTemplate};
      align-itmes: center;
      justify-items: stretch;
      user-select: none;
      opacity:1;
      transition: opacity 0.2s;
  }
  dialog-inner.pui-adding,
  dialog-inner.pui-removing{
      opacity:0;
  }


  avatar-portrait{
      grid-area: portrait;
      border: 1px solid purple;
      border-radius: 3px;
      user-select: none;
  }
  
  avatar-portrait2{
      grid-area: portrait2;
      border: 1px solid purple;
      border-radius: 3px;
      user-select: none;
  }

  dialog-content{
      grid-area: content;
      border: 1px solid purple;
      border-radius: 3px;
      user-select: none;
  }

  dialog-choice1{
      grid-area: choice1;
      border: 1px solid purple;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
  }
  dialog-choice2{
      grid-area: choice2;
      border: 1px solid purple;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
  }
  dialog-choice3{
      grid-area: choice3;
      border: 1px solid purple;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
  }

  dialog-choice1:hover,
  dialog-choice2:hover,
  dialog-choice3:hover{
      background-color:purple;
      color:AntiqueWhite;
  }


  dialog-submit{
      grid-area: submit;
      border: 1px solid purple;
      border-radius: 3px;
      font-size: xx-small;
      cursor: pointer;
      display: flex; 
      flex-direction:column; 
      justify-content: center;
      align-items: center;
      user-select: none;
  }


</style>

  <dialog-container \${===isDialogActive} >
      <dialog-inner \${!==isTransitionActive}>
          <avatar-portrait \${===dm.isLeftVisible} style="background-image: url(\${dm.portraitLeft}); background-size: cover;"></avatar-portrait>
          <avatar-portrait2 \${===dm.isRightVisible} style="background-image: url(\${dm.portraitRight}); background-size: cover;" ></avatar-portrait2>
          <dialog-content \${===dm.isContentVisible}>\${dm.dialogContent}</dialog-content>
          <dialog-choice1 data-index="0" \${===dm.isChoice1Enabled} \${click@=>dm.selectOption}>\${dm.choice1Content}</dialog-choice1>
          <dialog-choice2 data-index="1" \${===dm.isChoice2Enabled} \${click@=>dm.selectOption}>\${dm.choice2Content}</dialog-choice2>
          <dialog-choice3 data-index="2" \${===dm.isChoice3Enabled} \${click@=>dm.selectOption}>\${dm.choice3Content}</dialog-choice3>
          <dialog-submit \${click@=>dm.runNext} \${===dm.isSubmitEnabled}><div>\${dm.submitText}</div></dialog-submit>
      </dialog-inner>
  </dialog-container>
  
  `;
  dialogSignal: Signal = new Signal("dialog");
  isDialogActive: boolean = true;
  isTransitionActive: boolean = false;
  public constructor() {
    super("Dialog");
    this.dialogSignal.listen(this.dialogHandler);
  }

  public processEntity(entity: DialogEntity): boolean {
    return true;
  }

  dialogHandler(signalData: CustomEvent) {}

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: DialogEntity[]): void {}
}
