import MobileObject from '../MobileObject.js';
import { StaticObject } from '../StaticObjects.js';
export default class AutomatedObject extends MobileObject {

    constructor(x, y, width, height, walkAccel, jumpSpeed, input) {
        super(x, y, width, height, walkAccel, jumpSpeed);
        this.input = input;
        this.fallAtEdge = false;
    }

    step(dt, time) {
        if (!this.fallAtEdge) {
            this.checkEdge();
        }
        super.step(dt, this.input, time);
    }

    resolveColission(object, side) {
        if (object instanceof StaticObject) {
            if (side === "left" || side === "right") {
                this.turnAround();
                // this.x = object.x + object.width;
            // } else if (side === "right") {
                // this.turnAround();
                // this.x = object.x - this.width;
            } else {
                super.resolveColission(object, side);
            }
        }
    }

    turnAround() {
        this.speedX *= -1;
        this.input.left = !this.input.left;
        this.input.right = !this.input.right;
    }


    checkEdge() {
        // this.standingOn = [obj1, obj2, obj3]
        if (this.standingOn.length != 0){
            // Maximum x value + width for all standingOn objects
            const maxx = this.standingOn.reduce((max, obj) => {
                return obj.x + obj.width > max ? obj.x + obj.width : max;
            }, this.x);
            const minx = this.standingOn.reduce((min, obj) => {
                return obj.x < min ? obj.x : min;
            }
            , this.x+this.width);
            if (maxx + 0.5 < this.x + this.width && this.input.right) {
                this.turnAround();
            }
            if (minx - 0.5 > this.x && this.input.left) {
                this.turnAround();
            }
        }

    }

}


