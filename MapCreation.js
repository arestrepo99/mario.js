import Mario from './GameObjects/Mario.js';
import Turtle from './GameObjects/AutomatedObjects/Turtle.js';
import Goomba from './GameObjects/AutomatedObjects/Goomba.js'; 
import { Mushroom1Up , Mushroom } from './GameObjects/AutomatedObjects/Objects.js';
import { Rock, Brick, QuestionBlock, Pipe, Cloud, Bush, BackgroundHill, HardBlock, JumpingCoin } from './GameObjects/StaticObjects.js';
import { Map } from './GamePlay.js';




// MAP CREATION
const MARIO = new Mario(6, 2);

const trickTurtle = new Turtle(null, null, {right: true})
trickTurtle.fallAtEdge = true;

const STATICOBJECTS = [
    new BackgroundHill(2, 5, 3),
    new Rock(0, 0, 69, 2),
    new Cloud(8, 10, 2),
    new Bush(11, 2, 5),
    new QuestionBlock(16, 5, 1, 1, trickTurtle),
    new BackgroundHill(17, 4, 2),
    new Cloud(19, 11, 2),
    new Brick(20, 5, 1, 1),
    new QuestionBlock(21, 5, 1, 1, new Mushroom(null, null, {right: true})),
    new Brick(22, 5, 1, 1),
    new QuestionBlock(22, 9, 1, 1, new JumpingCoin()),
    new QuestionBlock(23, 5, 1, 1, new JumpingCoin()),
    new Bush(23, 2, 3),
    new Brick(24, 5, 1, 1),
    new Cloud(27, 10, 4),
    new Pipe(28, 2, 2),
    new Cloud(36, 11, 3),
    new Pipe(38, 2, 3),
    new Bush(41, 2, 4),
    new Pipe(46, 2, 4),
    new BackgroundHill(50, 5, 3),
    new Cloud(56, 10, 2),
    new Pipe(57, 2, 4) ,
    new Bush(60, 2, 4),
    new BackgroundHill(65, 4, 2),
    new Cloud(67, 11, 2),
    new Rock(71, 0, 15, 2),
    new Bush(71, 2, 4),
    new Cloud(75, 10, 4),
    new Brick(77, 5, 1, 1),
    new QuestionBlock(78, 5, 1, 1, new JumpingCoin()),
    new Brick(79, 5, 1, 1),
    new Brick(80, 9, 8, 1),
    new Cloud(84, 11, 3),
    new Rock(89, 0, 64, 2),
    new Bush(89, 2, 4),
    new Brick(91, 9, 3, 1),
    new QuestionBlock(94, 9, 1, 1, new JumpingCoin()),
    new Brick(94, 5, 1, 1),
    new BackgroundHill(98, 5, 3),
    new Brick(100, 5, 2, 1),
    new Cloud(104, 10, 2),
    new QuestionBlock(106, 5, 1, 1, new JumpingCoin()),
    new Bush(107, 2, 5),
    new QuestionBlock(109, 5, 1, 1, new JumpingCoin()),
    new QuestionBlock(109, 9, 1, 1, new JumpingCoin()),
    new QuestionBlock(112, 5, 1, 1, new JumpingCoin()),
    new BackgroundHill(113, 4, 2),
    new Cloud(115, 11, 2),
    new Brick(118, 5, 1, 1),
    new Bush(119, 2, 3),
    new Brick(121, 9, 3, 1),
    new Cloud(123, 11, 4),
    new Brick(128, 9, 1, 1),
    new QuestionBlock(129, 9, 1, 1, new JumpingCoin()),
    new Brick(129, 5, 1, 1),
    new QuestionBlock(130, 9, 1, 1, new JumpingCoin()),
    new Brick(130, 5, 1, 1),
    new Brick(131, 9, 1, 1),
    new Cloud(132, 11, 3),
    new Bush(137, 2, 4),
    new HardBlock(134, 2, 4, 1),
    new HardBlock(135, 3, 3, 1),
    new HardBlock(136, 4, 2, 1),
    new HardBlock(137, 5, 1, 1),
    new HardBlock(140, 5, 1, 1),
    new HardBlock(140, 4, 2, 1),
    new HardBlock(140, 3, 3, 1),
    new HardBlock(140, 2, 4, 1),
    new BackgroundHill(146, 5, 3),
    new HardBlock(148, 2, 5, 1),
    new HardBlock(149, 3, 4, 1),
    new HardBlock(150, 4, 3, 1),
    new HardBlock(151, 5, 2, 1),
    new Bush(158, 2, 2),
    new HardBlock(155, 5, 1, 1),
    new HardBlock(155, 4, 2, 1),
    new HardBlock(155, 3, 3, 1),
    new HardBlock(155, 2, 4, 1),
    new Rock(155, 0, 56, 2),
    new BackgroundHill(161, 4, 2),
    new Pipe(163, 2, 2),
    new Bush(167, 2, 3),
    new Brick(168, 5, 2, 1),
    new QuestionBlock(170, 5, 1, 1, new JumpingCoin()),
    new Brick(171, 5, 1, 1),
    new Cloud(171, 10, 4),
    new Pipe(179, 2, 2),
    // 8 High stairs
    new HardBlock(181, 2, 8, 1),
    new HardBlock(182, 3, 7, 1),
    new HardBlock(183, 4, 6, 1),
    new HardBlock(184, 5, 5, 1),
    new HardBlock(185, 6, 4, 1),
    new HardBlock(186, 7, 3, 1),
    new HardBlock(187, 8, 2, 1),
    new HardBlock(188, 9, 1, 1),
    new HardBlock(189, 2, 1, 8),
];

// toatal.toShell();
const MOBILEOBJECTS = [
    new Turtle(16, 2, {right: true}),
    new Goomba(20, 2, {right: true}),
    new Goomba(32, 2, {right: true}),
    new Goomba(42, 2, {right: true}),
    new Goomba(44, 2, {right: true}),
    // new Turtle(14, 2, {left: true}),
    // new Turtle(13, 2, {left: true}),
    // new Turtle(10, 2, {left: true}),
    // new Turtle(32, 2, {right: true}),
    // new Turtle(24, 2, {left: true}),
    // new Turtle(50, 2, {right: true}),
];

// STATICOBJECTS.forEach(object => {
//     const rock = object instanceof Rock;
//     if (!rock){
//         if (MARIO.x < object.x + object.width + 2){
//             MARIO.x = object.x + object.width + 2;
//         }
//     }
// })

export default new Map(MARIO, MOBILEOBJECTS, STATICOBJECTS);
