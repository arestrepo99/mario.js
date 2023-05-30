import MobileObject from './MobileObject.js';

const MARIOACCEL = 700;
const MARIOJUMPSPEED = 330;

export default class Mario extends MobileObject {
    constructor(x, y) {
        super(x, y, 10, 20, 'red', MARIOACCEL, MARIOJUMPSPEED);
    }
    step(dt, input) {
        if (this.y < 0) {this.active = false;}
        super.step(dt, input);
    }
}

