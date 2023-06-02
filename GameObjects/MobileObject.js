import GameObject from "./GameObject.js";
import { HardObject } from "./StaticObjects.js";
const GRAVITY_ACCELERATION = -9.8 * 10; // ten times earth gravity
const oppositeSideMap = {"top": "bottom", "bottom": "top", "left": "right", "right": "left"}
export default class MobileObject extends GameObject {
    constructor(x, y, width, height, walkAccel, jumpSpeed) {
        super(x, y, width, height);
        this.walkAccel = walkAccel;
        this.jumpSpeed = jumpSpeed;
        this.standingOn = [];
        this.speedX = 0;
        this.speedY = 0;
        this.accelX = 0;
        this.dead = false;
        this.active = true;
    }

    freeFall() {
        return !this.standingOn.length;
    }

    step(dt, input) {
        // Call super class step
        super.step(dt);

        // Bounds
        if (this.y < -this.height) {this.active = false;}
        
        // Gravity
        // this.checkFloor();
        this.speedX += this.accelX * dt;
        if (this.freeFall()) {
            this.speedY += GRAVITY_ACCELERATION * dt;
        }
        // Friction
        this.speedX *= 0.9;

        // Input
        if (!this.dead) {
            if (input.up) {this.jump();}
            if (input.left) {this.accelX = -this.walkAccel;}
            else if (input.right) {this.accelX = this.walkAccel;}
            else {this.accelX = 0;}
        }
            
        // Dynamic system
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;

        // Reset standingOn (will be reset by collision detection)
        this.standingOn = [];

        if (this.y < 0) {this.active = false;}
        // Set looking direction for drawing
        if (input['left']) {
            this.lookingDirection = 'left';
        } else if (input['right']) {
            this.lookingDirection = 'right';
        }
       
    }
    jump() {
        if (!this.freeFall()) {
            this.speedY = this.jumpSpeed;
            this.standingOn = [];
        }
    }


    collisionDetection(object) {
        // Check if in same horizontal range
        // right (ture if object's left side is to the right of this object's right side)
        // left (true if object's right side is to the left of this object's left side)
        const right = object.x < this.x + this.width;
        const left = object.x + object.width > this.x;
        if (right && left) {
            // Check if in same vertical range
            // top (true if object's bottom side is above this object's top side)
            // bottom (true if object's top side is below this object's bottom side)
            const top = object.y < this.y + this.height;
            const bottom = object.y + object.height > this.y;
            if (top && bottom) {
                // Find time of collision
                let time = -Infinity;
                let side = null;
                
                const topTime = (object.y - this.y - this.height) / (this.speedY - object.speedY);
                if (topTime<0 && topTime>time) {time = topTime; side = "top";}
                const bottomTime = (object.y + object.height - this.y) / (this.speedY - object.speedY);
                if (bottomTime<0 && bottomTime>time) {time = bottomTime; side = "bottom";}
                const rightTime = (object.x - this.x - this.width) / (this.speedX - object.speedX);
                if (rightTime<0 && rightTime>time) {time = rightTime; side = "right";}
                const leftTime = (object.x + object.width - this.x) / (this.speedX - object.speedX);
                if (leftTime<0 && leftTime>time) {time = leftTime; side = "left";}
                console.log(object, this, side)           
                return {time, side};     
            }
        }
        return false;
    }
        
    collide(object) {
        if (this.dead || object.dead) {return;}
        if (this === object) {return;}
        const collision = this.collisionDetection(object);
        this.getStanding(object);
        if (collision) {
            const {time, side} = collision;
            const oppositeSide = oppositeSideMap[side];

            // Move objects to time of collision (time is negative)
            this.x += this.speedX * time;
            this.y += this.speedY * time;
            object.x += object.speedX * time;
            object.y += object.speedY * time;
            // Resolve collision
            this.resolveColission(object, side);
            object.resolveColission(this, oppositeSide);
            // Move objects to time of rest
            this.x += this.speedX * -time;
            this.y += this.speedY * -time;
            object.x += object.speedX * -time;
            object.y += object.speedY * -time;
        }
    }

    getStanding(object) {
        if (object instanceof HardObject) {
            // Check Horizontal range
            if (object.x < this.x + this.width && object.x + object.width > this.x) {
                // Check vertical range
                if (this.y === object.y + object.height) {
                    this.standingOn.push(object);
                }
            }
        }
    }

    resolveColission(object, side) {
        if (object instanceof HardObject) {
            if (side === "right") {this.speedX = 0; this.x = object.x - this.width;}
            else if (side === "left") {this.speedX = 0; this.x = object.x + object.width;}
            else if (side === "bottom") {this.speedY = 0; this.standingOn.push(object); this.y = object.y + object.height;}
            else if (side === "top") {this.speedY = 0; this.y = object.y - this.height;}
        }
    }

    // checkFloor() {
    //     // Make sure all objects are in the same horizontal range
    //     this.standingOn.filter(object =>
    //         object.x < this.x + this.width &&
    //         object.x + object.width > this.x
    //     );          
    // }

    die() {
        this.dead = true;
        this.standingOn = [this];
        this.jump();
    }
}