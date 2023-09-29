import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_Squeleto/entity";
import { Assets } from "@peasy-lib/peasy-assets";
import { Vector } from "../../_Squeleto/Vector";

const heroAnimation = {
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

export class HeroEntity {
  static create(startingVector: Vector) {
    let id = uuidv4();
    const myMap = "kitchen";
    return Entity.create({
      id: id,
      components: {
        position: startingVector,
        zindex: 0,
        size: { data: [32, 32] },
        opacity: 1,
        camerafollow: { data: true },
        velocity: { data: new Vector(0, 0) },
        keyboard: { data: true },
        collider: {
          data: {
            id: id,
            startingPosition: startingVector,
            size: new Vector(16, 8),
            offset: new Vector(8, 24),
            layer: 3,
            layerMask: [true, true, true, false, true],
            map: myMap,
          },
        },
        map: myMap,
        spritesheet: {
          data: [
            {
              src: Assets.image("shadow").src,
              offset: { x: 0, y: 0 },
              size: { x: 32, y: 32 },
              framesize: { x: 32, y: 32 },
            },
            {
              src: Assets.image("hero").src,
              offset: { x: 0, y: 0 },
              size: { x: 128, y: 128 },
              framesize: { x: 32, y: 32 },
              animation: heroAnimation,
            },
          ],
        },
      },
    });
  }
}

/*
  startingPostion: Vector;
    size: Vector;
    layerMask: boolean[];
    layer: number;
*/