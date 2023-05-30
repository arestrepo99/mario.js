import AutomatedObject from './AutomatedObject.js';
import Mario from '../Mario.js';
import { StaticObject } from '../StaticObjects.js';

const TURTLE_ACCEL = 300;
const TURTLE_JUMP_SPEED = 200;
const TURTLE_SHELL_ACCEL = 1000;

export default class Turtle extends AutomatedObject {
    constructor(x, y, input) {
        super(x, y, 10, 20, 'blue', TURTLE_ACCEL, TURTLE_JUMP_SPEED, input);
        this.mode = 'walk';
    }

    toShell() {
        this.mode = 'shell';
        this.speedX = 0;
        this.speedY = 0;
        this.walkAccel = TURTLE_SHELL_ACCEL;
        this.height = 10;
        this.input = {left: false, right: false, up: false, down: false};
    }

    step(dt) {
        super.step(dt, this.input);
    }

    resolveColission(object, side) {
        object; side;
    }

    resolveColission(object, side) {
        super.resolveColission(object, side);
        // console.log(side)
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
                    object.standingOn = this;
                    object.jump();
                    break;
                case "bottom":
                    object.die(); break;
                case "left":
                    if (this.mode === 'walk') { 
                        object.die(); 
                    }
                    else if (this.input.right){
                        object.die();
                    } else { 
                        this.input.right = true;
                        this.speedX = object.speedX;
                        this.x = object.x + object.width;
                    }
                    break;
                case "right":
                    if (this.mode === 'walk') { 
                        object.die(); 
                    }
                    else if (this.input.left){ 
                        object.die();
                    } else { 
                        this.input.left = true;
                        this.speedX = object.speedX;
                        this.x = object.x - this.width;
                    }
                    break;
            }
        }
        if (object instanceof Turtle) {
            if (this.mode === 'shell') {
                if (this.input.left || this.input.right) {
                    object.die();
                }
            }
        }
        if ( object instanceof StaticObject) {
            // Calculate how deep it is in the object
            if (side === "left" || side === "right") {
                this.crashBounce(object);
            }
        }
    }
    checkFloor() {
        if (this.standingOn) {
            if (this.x < this.standingOn.x || this.x > this.standingOn.x + this.standingOn.width - this.width) {
                if (this.mode === 'shell'){
                    this.standingOn = null;
                } else if (this.mode === 'walk') {
                    this.speedX *= -1;
                    this.input.left = !this.input.left;
                    this.input.right = !this.input.right;
                }
            }
        }
    }
}