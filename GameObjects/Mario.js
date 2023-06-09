import MobileObject from './MobileObject.js';
import { Game } from '../GamePlay.js';

const tilemap = new Image();
tilemap.src = "tilemaps/mario.png";

const MARIOACCEL = 80;
const MARIOJUMPSPEED = 30;

const renderSectionMap = {
    'small': {
        'idle': {'x':0, 'y':0, 'w':16, 'h':16},
        'walk': [{'x':16, 'y':0, 'w':16, 'h':16}, {'x':32, 'y':0, 'w':16, 'h':16}, {'x':48, 'y':0, 'w':16, 'h':16}],
        'break': {'x':64, 'y':0, 'w':16, 'h':16},
        'jump': {'x':80, 'y':0, 'w':16, 'h':16},
        'dead': {'x':96, 'y':0, 'w':16, 'h':16},
    },
    'big': {
        'idle': {'x':0, 'y':16, 'w':16, 'h':32},
        'walk': [{'x':16, 'y':16, 'w':16, 'h':32}, {'x':32, 'y':16, 'w':16, 'h':32}, {'x':48, 'y':16, 'w':16, 'h':32}],
        'break': {'x':64, 'y':16, 'w':16, 'h':32},
        'jump': {'x':80, 'y':16, 'w':16, 'h':32},
        'dead': {'x':96, 'y':16, 'w':16, 'h':32},
    },
    'fire': {
        'idle': {'x':0, 'y':48, 'w':16, 'h':32},
        'walk': [{'x':16, 'y':48, 'w':16, 'h':32}, {'x':32, 'y':48, 'w':16, 'h':32}, {'x':48, 'y':48, 'w':16, 'h':32}],
        'break': {'x':64, 'y':48, 'w':16, 'h':32},
        'jump': {'x':80, 'y':48, 'w':16, 'h':32},
        'dead': {'x':96, 'y':48, 'w':16, 'h':32},
    }
}

import { Fireball } from './AutomatedObjects/Objects.js';

export default class Mario extends MobileObject {
    constructor(x, y) {
        super(x, y, 16/16, 16/16, MARIOACCEL, MARIOJUMPSPEED);
        this.mode = 'small';
        this.printedTime = 0;
        this.tilemap = tilemap;
        // this.fire();
        this.lookingDirection = 'right';
    }

    step(dt, input) {
        this.input = input; // Save input for rendering
        super.step(dt, input);
        // if (this.immune) {
        //     // Be inmune for 2 seconds
        //     if (this.clock.time - this.immune.start > 2) {
        //         this.immune = null;
        //     }
        // }
        if (input.action){
            return this.action();
        }
    }

    action(){
        if (this.mode == 'fire'){
            return this.shootFireball();
        }
    }

    shootFireball(){
        if (!this.lastFire) {
            this.lastFire = this.clock.time;
            this.wait(0.5, () => {this.lastFire = null;});
            let direction
            if (this.input.right && !this.input.left) {
                direction = 'right';
            } else if (this.input.left && !this.input.right) {
                direction = 'left';
            } else {
                direction = this.lookingDirection;
            }
            console.log('Fireball', direction)
            return {type: "addObject", object: new Fireball(this.x, this.y+1, direction == 'right' ? {right: true} : {left: true})};
        }
    }


    getRenderSection() {
        let section
        let breaking = false;
        if (this.dead) {
            section = renderSectionMap[this.mode]['dead'];
        } else if (this.freeFall()) {
            section = renderSectionMap[this.mode]['jump'];
        } else if (this.speedX > 1) {
            if (!this.input['right']) {
                section = renderSectionMap[this.mode]['break'];
                breaking = true;
            } else {
                section = renderSectionMap[this.mode]['walk'][Math.floor(this.clock.time * 10) % 3];
            }
        } else if (this.speedX < -1) {
            if (!this.input['left']) {
                section = renderSectionMap[this.mode]['break'];
                breaking = true;
            } else {
                section = renderSectionMap[this.mode]['walk'][Math.floor(this.clock.time * 10) % 3];
            }
        } else {
            section = renderSectionMap[this.mode]['idle'];
        }
        if (this.lookingDirection == 'left') {
            if (!breaking) {
                section = { x : section['x'] + 16*7, y : section['y'], w : section['w'], h : section['h'] };
            }
        } else {
            if (breaking) {
                section = { x : section['x'] + 16*7, y : section['y'], w : section['w'], h : section['h'] };
            }
        }
        return section;
    }


    draw(ctx, camera) {
        if (this.immune) {
            // Blink every 0.1 seconds
            if (Math.floor(this.clock.time * 10) % 2 == 0) {return;}
        }
        super.draw(ctx, camera);
    }

    big(){
        this.mode = 'big';
        this.width = 1;
        this.height = 2;
    }

    small(){
        this.mode = 'small';
        this.width = 1;
        this.height = 1;
    }

    fire(){
        this.mode = 'fire';
        this.width = 1;
        this.height = 2;
    }

    die() {
        if (this.immune) {
            return;
        }
        if (this.mode == 'fire') {
            this.big();
            this.immune = true;
            this.wait(2, () => {
                this.immune = false;
            });
        }
        else if (this.mode == 'big') {
            this.small();
            this.immune = true;
            this.wait(2, () => {
                this.immune = false;
            });
        } else {
            super.die();
        }
    }
}

