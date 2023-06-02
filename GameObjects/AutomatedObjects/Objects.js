import AutomatedObject from './AutomatedObject.js';
import Mario from '../Mario.js';
import { HardObject } from '../StaticObjects.js';

const tilemap = new Image();
tilemap.src = "tilemaps/objects.png";


export class Mushroom extends AutomatedObject {
    constructor(x, y, input) {
        super(x, y, 1, 1, 20, 30 , input);
        this.input = input;
        this.fallAtEdge = true;
        this.tilemap = tilemap;
    }


    getRenderSection() {
        return {x:0, y:0, h:16, w:16};
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof Mario) {
            if (object.mode = 'small') {
                object.big();
            }
            this.active = false;
        }
    }

}

export class Mushroom1Up extends Mushroom {
    constructor(x, y, input) {
        super(x, y, input);
        this.tilemap = tilemap;
    }

    getRenderSection() {
        return {x:0, y:0, h:16, w:16};
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof Mario) {
            object.lives += 1;
            this.active = false;
        }
    }
}

export class FireFlower extends AutomatedObject {
    constructor(x, y) {
        super(x, y, 1, 1, 0,0, {});
        this.tilemap = tilemap;
    }

    getRenderSection() {
        return [
            // All second row
            {x:0, y:16, h:16, w:16},
            {x:16, y:16, h:16, w:16},
            {x:32, y:16, h:16, w:16},
            {x:48, y:16, h:16, w:16},
        ][Math.floor(this.clock.time*10 % 4)];
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof Mario) {
            object.fire();
            this.active = false;
        }
    }


}

const FIREBALL_ACCEL = 120;
const FIREBALL_JUMP_SPEED = 15;

export class Fireball extends AutomatedObject {
    constructor(x, y, input) {
        super(x, y, 0.5, 0.5, FIREBALL_ACCEL, FIREBALL_JUMP_SPEED , input);
        this.tilemap = tilemap;
        this.input.up = true;
        this.fallAtEdge = true;
        if (input.right) {
            this.speedX = 5;
        } else {
            this.speedX = -5;
        }
    }

    getRenderSection() {
        return [
            {x:48,     y:16*2,     h:8, w:8},
            {x:48 + 8, y:16*2,     h:8, w:8},
            {x:48,     y:16*2 + 8, h:8, w:8},
            {x:48+ 8,  y:16*2 + 8, h:8, w:8},
        ][Math.floor(this.clock.time*10 % 4)];
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof HardObject && ( side === 'left' || side === 'right')) {
            this.die();
        }
        if (object instanceof AutomatedObject && !(object instanceof Fireball)) {
            object.die();
            this.die();
        }
    }

    die(){
        this.active = false;
    }
}