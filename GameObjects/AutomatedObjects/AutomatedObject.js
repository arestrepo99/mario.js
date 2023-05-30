import MobileObject from '../MobileObject.js';

export default class AutomatedObject extends MobileObject {

    constructor(x, y, width, height, color, walkAccel, jumpSpeed, input) {
        super(x, y, width, height, color, walkAccel, jumpSpeed);
        this.input = input;
    }

    crashBounce(StaticObject) {
        if (this.speedX > 0) {
            const depth = this.x + this.width - StaticObject.x;
            this.x -= depth * 2;
        } else {
            const depth = StaticObject.x + StaticObject.width - this.x;
            this.x += depth * 2;
        }
        this.speedX *= -1;
        this.input.left = !this.input.left;
        this.input.right = !this.input.right;
    }

    // die() {
    //     // this.active = false;
    //     // this.accelX = 0;
    //     // this.speedX = 5;
    //     // this.speedY = 5;
    // }
}


