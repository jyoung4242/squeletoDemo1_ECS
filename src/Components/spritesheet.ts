import { Vector } from "../../_Squeleto/Vector";
import { Component } from "../../_Squeleto/component";

// you can define the incoming types when the component is created
export interface ISpriteSheetComponent {
  data: SpriteSheetType;
}
export type SpriteSheetType = Array<{
  src: string;
  offset: Vector;
  size: Vector;
  animation: any;
  framePosition: Vector;
  animationTik?: number;
  currentFrameIndex: number;
  currentSequence: string;
}>;

// this is the exported interface that is used in systems modules
export interface SpriteSheetComponent {
  spritesheet: SpriteSheetType;
}

export class SpriteSheetComp extends Component {
  // UI template string literal with UI binding of value property
  public template = `
  <style>
    spritesheet-object{
          display: block;
          position: absolute;
          top:0;
          left:0;
          image-rendering: pixelated;
          background-repeat: no-repeat;
      }
  </style>
  <spritesheet-layer class="sprite-component">
      <spritesheet-object \${sprite<=*value} style="background-size: \${sprite.size.x}px \${sprite.size.y}px; background-position: -\${sprite.framePosition.x}px -\${sprite.framePosition.y}px;background-image: url(\${sprite.src}); width: \${sprite.framesize.x}px;height: \${sprite.framesize.y}px; transform: translate3d(\${sprite.offset.x}px, \${sprite.offset.y}px,0px);"></spritesheet-object>
  </spritesheet-layer>
  `;

  //setting default value
  public value: SpriteSheetType = [];
  public constructor() {
    //@ts-ignore
    super("spritesheet", SpriteSheetComp, true);
  }

  public define(data: ISpriteSheetComponent): void {
    if (data == null) {
      return;
    }
    this.value = data.data;
    this.value.forEach(sprite => {
      if (sprite.animation) {
        Object.assign(sprite, {
          framePosition: new Vector(0, 0),
          animationTik: 0,
          currentFrameIndex: 0,
          currentSequence: sprite.animation.default,
        });
      } else {
        Object.assign(sprite, {
          framePosition: new Vector(0, 0),
        });
      }
    });
  }
}
