import AutomatedObject from './AutomatedObject.js';
import Mario from '../Mario.js';
import Goomba from './Goomba.js';

const TURTLE_ACCEL = 20;
const TURTLE_JUMP_SPEED = 30;
const TURTLE_SHELL_ACCEL = 100;

const tilemap = new Image();
tilemap.src = "tilemaps/turtle.png";

const renderSectionMap = {
    'walk': [{'x':0, 'y':0, 'w':16, 'h':24}, {'x':16, 'y':0, 'w':16, 'h':24}],
    'fly': [{'x':32, 'y':0, 'w':16, 'h':24}, {'x':48, 'y':0, 'w':16, 'h':24}],
    'shell': {'x':128, 'y':0, 'w':16, 'h':16},
    'shellStanding': {'x':144, 'y':0, 'w':16, 'h':16},
    'dead': {'x':160, 'y':0, 'w':16, 'h':16},
}


export default class Turtle extends AutomatedObject {
    constructor(x, y, input) {
        super(x, y, 1, 24/16, TURTLE_ACCEL, TURTLE_JUMP_SPEED, input);
        this.mode = 'walk';
        this.tilemap = tilemap;
    }

    step(dt) {
        super.step(dt);
        this.dt = dt;
    }

    activate() {
        super.activate();
        // this.wait(0.5, () => {
        //     console.log(this.speedX);
        // }, true);
    }

    toShell() {
        this.mode = 'shell';
        this.speedX = 0;
        this.speedY = 0;
        this.walkAccel = TURTLE_SHELL_ACCEL;
        this.height = 1;
        this.fallAtEdge = true;
        this.input = {left: false, right: false, up: false, down: false};
    }

    resolveColission(object, side) {
        super.resolveColission(object, side);
        if ( object instanceof Mario ) {
            switch (side) {
                case "top":
                    if (this.mode === 'walk') {                       // Turtle is walking
                        this.toShell();
                    } else if (this.input.left || this.input.right) { // Turtle is moving shell
                        this.speedX = 0;
                        this.input = {left: false, right: false, up: false, down: false};
                    } else {                                            // Shell is stationary
                        object.x > this.x ? this.input.left = true : this.input.right = true;
                    }
                    object.standingOn = [this];
                    object.jump();
                    break;
                case "bottom":
                    object.die(); break;
                case "left":
                    if (this.mode === 'walk') { 
                        object.die(); 
                    }
                    if (this.mode === 'shell') {
                        if (this.input.left) {
                            object.die();
                        } else {
                            this.input.right = true;
                            this.speedX = object.speedX;
                            this.x = object.x + object.width;
                        }
                    }
                    break;
                case "right":
                    if (this.mode === 'walk') { 
                        object.die(); 
                    }
                    if (this.mode === 'shell') {
                        if (this.input.right) {
                            console.log('Mario dies')
                            object.die();
                        } else {
                            this.input.left = true;
                            this.speedX = object.speedX;
                            this.x = object.x - this.width;
                        }
                    }
                    break;
            }
        }
        if (object instanceof Turtle || object instanceof Goomba) {
            if (this.mode === 'shell') {
                if (this.input.left || this.input.right) {
                    object.die();
                }
            }
        }
        // console.log(this.x, this.y)
    }

    die() {
        this.toShell();
        super.die();
    }


    getRenderSection() {
        let section
        if (this.dead) {
            section = renderSectionMap.dead;
        } else if (this.mode === 'shell') {
            section = renderSectionMap.shell;
        } else if (this.mode === 'walk') {
            section = renderSectionMap.walk[Math.floor(this.clock.time*10) % 2];
        } else {
            section = renderSectionMap.idle;
        }
        if (this.mode === 'walk') {
            if (this.lookingDirection == 'right') {
                section = { x : section['x'] + 16*4, y : section['y'], w : section['w'], h : section['h'] };
            }
        }
        return section;
        // Skip fly for now
    }

}