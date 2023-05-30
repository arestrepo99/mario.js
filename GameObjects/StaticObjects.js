import GameObject from "./GameObject.js";
import MobileObject from "./MobileObject.js";

export class StaticObject extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    resolveColission(object, side) {
        if (object instanceof MobileObject) {
            if (side === "left") {object.speedX = 0; object.x = this.x - object.width;}
            else if (side === "right") {object.speedX = 0; object.x = this.x + this.width;}
            else if (side === "top") {object.speedY = 0; object.standingOn = this; object.y = this.y + this.height;}
            else if (side === "bottom") {object.speedY = 0; object.y = this.y - object.height;}
        }
    }
}

export class Grass extends StaticObject {
    constructor(x, y, width, height) {
        super(x, y, width, height, "green");
    }   
}

export class UnbreakableBlock extends StaticObject {
    constructor(x, y, width, height) {
        super(x, y, width, height, "brown");
    }
}