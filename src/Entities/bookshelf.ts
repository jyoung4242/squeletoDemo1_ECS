import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_Squeleto/entity";
import { Vector } from "../../_Squeleto/Vector";
import { Assets } from "@peasy-lib/peasy-assets";

export class bookshelfEntity {
  static create(startingVector: Vector) {
    const id = uuidv4();
    const myMap = "kitchen";
    return Entity.create({
      id: id,
      components: {
        position: startingVector,
        zindex: 0,
        size: { data: [32, 26] },
        opacity: 1,
        sprites: {
          data: [{ src: Assets.image("bookshelf").src, offset: { x: 0, y: 0 }, size: { x: 32, y: 26 } }],
        },
        map: myMap,
        collider: {
          data: {
            id: id,
            startingPosition: startingVector,
            size: new Vector(32, 12),
            offset: new Vector(0, 16),
            layer: 2,
            layerMask: [false, false, false, true, false],
            map: myMap,
          },
        },
      },
    });
  }
}

/*
entities must have size, position, opacity, and zindex components as they are baked in properties in-line
*/
