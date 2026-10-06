import {LumenScene} from "./scenes/LumenScene.js";
import {ForestScene} from "./scenes/ForestScene.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#17231b",
  pixelArt: false,
  antialias: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [LumenScene, ForestScene]
});
