import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_Squeleto/entity";
import { Vector } from "../../_Squeleto/Vector";
import { Assets } from "@peasy-lib/peasy-assets";

const npcAnimation = {
  frameRate: 8,
  default: "idle-down",
  sequences: {
    "idle-right": [[0, 32]],
    "idle-left": [[0, 96]],
    "idle-up": [[0, 64]],
    "idle-down": [[0, 0]],
    "walk-right": [
      [0, 32],
      [32, 32],
      [64, 32],
      [96, 32],
    ],
    "walk-left": [
      [0, 96],
      [32, 96],
      [64, 96],
      [96, 96],
    ],
    "walk-up": [
      [0, 64],
      [32, 64],
      [64, 64],
      [96, 64],
    ],
    "walk-down": [
      [0, 0],
      [32, 0],
      [64, 0],
      [96, 0],
    ],
  },
};
export class NPCEntity {
  static create(startingVector: Vector) {
    const id = uuidv4();
    return Entity.create({
      id: id,
      components: {
        position: startingVector,
        zindex: 0,
        size: { data: [32, 33] },
        opacity: 1,
        spritesheet: {
          data: [
            { src: Assets.image("shadow").src, offset: { x: 0, y: 0 }, size: { x: 32, y: 32 }, framesize: { x: 32, y: 32 } },
            {
              src: Assets.image("npc2").src,
              offset: { x: 0, y: 0 },
              size: { x: 128, y: 128 },
              framesize: { x: 32, y: 32 },
              animation: npcAnimation,
            },
          ],
        },
        collider: {
          data: {
            id: id,
            startingPosition: startingVector,
            size: new Vector(16, 8),
            offset: new Vector(8, 24),
            layer: 4,
            layerMask: [true, true, true, true, false],
          },
        },
      },
    });
  }
}

/*
entities must have size, position, opacity, and zindex components as they are baked in properties in-line
*/
