import Mario from './GameObjects/Mario.js';
import Turtle from './GameObjects/AutomatedObjects/Turtle.js';
import { Grass, UnbreakableBlock } from './GameObjects/StaticObjects.js';
import { Game, EventLoop } from './GamePlay.js';




// MAP CREATION
const MARIO = new Mario(-5, 20)
MARIO.speedY = 100;
MARIO.speedX = 10;




// toatal.toShell();
const MOBILEOBJECTS = [
    new Turtle(100, 10, {left: true}),
    new Turtle(60, 70, {right: true}),
    new Turtle(110, 70, {right: true}),
    new Turtle(110, 70, {right: true}),
    new Turtle(180, 30, {left: true}),
];
const STATICOBJECTS = [
    new Grass(0, 0, 500, 10),
    new UnbreakableBlock(60, 60, 40, 10),
    new UnbreakableBlock(110, 60+10+50, 40, 10),
    new UnbreakableBlock(160, 60, 40, 10), 
    new Grass(140, 10, 100, 10),
    // hill
    new Grass(160, 20, 80, 10),
];

const GAMEMAP = new Game(MARIO, MOBILEOBJECTS, STATICOBJECTS);

// START GAME
const EVENTLOOP = new EventLoop(GAMEMAP);

console.log("STARTING GAME")
EVENTLOOP.start();