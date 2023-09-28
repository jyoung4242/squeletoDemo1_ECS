import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_Squeleto/entity";
import { Vector } from "../../_Squeleto/Vector";
import { Assets } from "@peasy-lib/peasy-assets";

export class CounterEntity {
  static create(startingVector: Vector) {
    const id = uuidv4();
    return Entity.create({
      id: uuidv4(),
      components: {
        position: startingVector,
        zindex: 0,
        size: { data: [32, 33] },
        opacity: 1,
        sprites: {
          data: [{ src: Assets.image("counter").src, offset: { x: 0, y: 0 }, size: { x: 32, y: 33 } }],
        },
        collider: {
          data: {
            id: id,
            startingPosition: startingVector,
            size: new Vector(32, 24),
            offset: new Vector(0, 8),
            layer: 2,
            layerMask: [false, false, false, true, false],
          },
        },
      },
    });
  }
}

/*
entities must have size, position, opacity, and zindex components as they are baked in properties in-line
*/
