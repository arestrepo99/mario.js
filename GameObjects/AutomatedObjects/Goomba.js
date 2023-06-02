import AutomatedObject from './AutomatedObject.js';
import Mario from '../Mario.js';

const tilemap = new Image();
tilemap.src = "tilemaps/Goomba.png";

const GOOMBA_ACCEL = 20;
const GOOMBA_JUMP_SPEED = 30;

export default class Goomba extends AutomatedObject {
    constructor(x, y, input) {
        super(x, y, 1, 1, GOOMBA_ACCEL, GOOMBA_JUMP_SPEED , input);
        this.input = input;
        this.fallAtEdge = true;
        this.tilemap = tilemap;
        this.sqished = false;
    }

    getRenderSection() {
        if (this.squished) {return {x:32, y:0, h:8, w:16};}
        if (this.dead) {return {x:48, y:0, h:16, w:16};}
        return [{x:0, y:0, h:16, w:16},{x:16, y:0, h:16, w:16}][Math.floor(this.clock.time*10) % 2];
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (this.sqished) {return;}
        if (object instanceof Mario) {
            switch (side) {
                case "top":
                    this.squish();
                    object.standingOn = [this];
                    object.jump();
                    break;
                default:
                    object.die();
                    break;
            }
        }
    }

    squish() {
        this.squished = true;
        this.input = {};
        this.height = 0.5;
        this.speedX = 0;
        this.wait(0.5, () => {this.die();this.active = false});
    }

}