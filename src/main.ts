// Library Modules
import { Viewport } from "@peasy-lib/peasy-viewport";
import { SceneManager } from "../_Squeleto/Scene";
import "./style.css";

// Content Modules
import { LoadComponents } from "./Components/_components";

// Scenes
import { Login } from "./Scenes/login";
import { Game } from "./Scenes/game";

// Setting up Viewport with a HUD layer and the Game layer
const VIEWPORT_WIDTH = 400;
const ASPECT_RATIO = 16 / 9;
const VIEWPORT_HEIGHT = VIEWPORT_WIDTH / ASPECT_RATIO;
console.log("vp height: ", VIEWPORT_HEIGHT);

let viewport = Viewport.create({ size: { x: VIEWPORT_WIDTH, y: VIEWPORT_HEIGHT } });
SceneManager.viewport = viewport;

// Components
LoadComponents();

//Load Scenes
let sceneMgr = new SceneManager();
sceneMgr.register(Login, Game);
sceneMgr.set("Login");
