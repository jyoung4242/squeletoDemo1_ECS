// Import all your Squeleto Modules
import { Scene, SceneManager } from "../../_Squeleto/Scene";
import { Assets } from "@peasy-lib/peasy-assets";
import { Engine } from "@peasy-lib/peasy-engine";
import { StoryFlagManager } from "../PlugIns/StoryFlagManager";
import { Chiptune } from "../Systems/Chiptune";
import { ParticleSystem } from "../PlugIns/Particles";
import { State } from "@peasy-lib/peasy-states";
import { UI } from "@peasy-lib/peasy-ui";

// Next import your specific game content (Objects, Maps,etc...)
import { Kitchen } from "../Maps/kitchen";
import { OutsideMap } from "../Maps/outside";

import { Player } from "../Game Objects/Player";
import { Counter } from "../Game Objects/Counter";
import { Bookshelf } from "../Game Objects/Bookshelf";
import { NPC1 } from "../Game Objects/npc1";
import { Planter } from "../Game Objects/planter";
import { PizzaThingy } from "../Game Objects/pizzathingy";
import { bookCaseParticleSystem } from "../Particles/bookcaseParticles";

// Finally Import your custom plug-ins
import { DialogManager } from "../PlugIns/DialogueManager";
import { HeroEntity } from "../Entities/hero";
import { Vector } from "../../_Squeleto/Vector";
import { bookshelfEntity } from "../Entities/bookshelf";
import { CounterEntity } from "../Entities/counter";
import { NPCEntity } from "../Entities/npc2";
import { Entity } from "../../_Squeleto/entity";
import { System } from "../../_Squeleto/system";
import { CameraFollowSystem } from "../Systems/CameraFollow";
import { MovementSystem } from "../Systems/movement";
import { KeyboardSystem } from "../Systems/keyboard";
import { AnimatedSpriteSystem } from "../Systems/animatedSprite";
import { ColliderEntity, CollisionDetectionSystem } from "../Systems/collisionDetection";
import { RenderSystem } from "../Systems/Rendering";
import { Signal } from "../../_Squeleto/Signals";
import { EventSystem } from "../Systems/Events";
import { StoryFlagSystem } from "../Systems/StoryFlags";
import { interactionSystem } from "../Systems/Interactions";

import { Dialogue } from "../Systems/dialog";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../main";

// All Squeleto Scenes are an extension of the Scene Class
export class Game extends Scene {
  pauseSignal: Signal = new Signal("pauseEngine");
  name: string = "Game";
  entities: Entity[] = [];
  renderedEntities: Entity[] = [];
  Systems: System[] = [];
  //****************************************** */
  // dm name here is critical for peasy bindings, cause they have to match what's in the plugin
  // when using plugins, be very careful how you access them
  //****************************************** */
  //dm = new DialogManager();
  // psystems = new bookCaseParticleSystem(Assets);

  // StoryFlag system uses a default set of conditions that gets passed around
  // If larger, this can be brought in from its own module
  storyFlags = {
    bookcaseVisits: false,
  };
  sm = new StoryFlagManager(this.storyFlags);

  /****************************************************
   * plug-ins are inserted after the renderer to ensure
   * they render on top of the game
   ****************************************************/
  public template = `<scene-layer class="scene" style="width: 100%; height: 100%; position: relative; top: 0; left:0; color: white;">
  
  < \${ System === } \${ System <=* Systems }>
  </scene-layer>`;

  bgm: Chiptune | undefined | null;

  public async enter(previous: State | null, ...params: any[]): Promise<void> {
    // **************************************
    // Loading Assets
    // **************************************
    Assets.initialize({ src: "../src/Assets/" });
    await Assets.load([
      "lower.png",
      "DemoUpper.png",
      "hero.png",
      "shadow.png",
      "counter.png",
      "bookshelf.png",
      "npc2.png",
      "outsideUpper.png",
      "outsidemod.png",
      "planter.png",
      "pizzazone.png",
      "step.wav",
      "error.wav",
      "door.mp3",
      "spark.png",
      "spark.mp3",
      "npcAvatar.png",
      "heroAvatar.png",
    ]);

    // *************************************
    // Setup Viewport Layers
    // *************************************

    SceneManager.viewport.addLayers([
      {
        name: "maplower",
        parallax: 0,
        image: Assets.image("lower").src,
        size: { x: 192, y: 192 },
        position: { x: 192 / 2, y: 192 / 2 },
      },
      { name: "game", parallax: 0, size: { x: 0, y: 0 } },
      {
        name: "mapupper",
        parallax: 0,
        image: Assets.image("DemoUpper").src,
        size: { x: 192, y: 192 },
        position: { x: 192 / 2, y: 192 / 2 },
      },
      {
        name: "dialog",
        size: { x: VIEWPORT_WIDTH, y: VIEWPORT_HEIGHT },
      },
    ]);
    let layers = SceneManager.viewport.layers;

    const game = layers.find(lyr => lyr.name == "game");
    if (game) this.view = UI.create(game.element as HTMLElement, this, this.template);
    if (this.view) await this.view.attached;

    const dialog = layers.find(lyr => lyr.name == "dialog");
    if (dialog) UI.create(dialog.element, new Dialogue(), Dialogue.template);

    // **************************************
    // Load Objects
    // **************************************
    this.entities.push(bookshelfEntity.create(new Vector(48, 48)));
    this.entities.push(CounterEntity.create(new Vector(112, 96)));
    let hero = HeroEntity.create(new Vector(60, 60));

    this.entities.push(hero);
    this.entities.push(NPCEntity.create(new Vector(32, 96)));

    const dc = new CollisionDetectionSystem([Kitchen], "kitchen", false);
    dc.loadEntities(this.entities as ColliderEntity[]);

    console.log(this.entities);

    this.Systems.push(
      new CameraFollowSystem(),
      dc,
      new MovementSystem(),
      new KeyboardSystem(),
      new AnimatedSpriteSystem(),
      new RenderSystem("kitchen"),
      new EventSystem(),
      new interactionSystem()
    );

    // Turn on BGM
    this.bgm = new Chiptune("0x090100700135583f70");
    this.bgm.attenuate(0.05); //.1 is max, 0 is mute

    StoryFlagSystem.setStoryFlagValue("startOfGame", true);

    // **************************************
    // START your engines!
    // **************************************
    const engine = Engine.create({ started: true, fps: 60, callback: this.update });
    this.pauseSignal.listen(() => {
      console.log("pausing");
      engine.pause();
    });
  }

  update = (deltaTime: number) => {
    this.Systems.forEach(sys => sys.update(deltaTime, performance.now(), this.entities));
  };

  public exit() {}
}
