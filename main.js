import { Game } from './GamePlay.js';
import MAP from './MapCreation.js';

// START GAME
const GAME = new Game(MAP);

console.log("STARTING GAME")
GAME.start();