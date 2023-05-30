import GameObject from "./GameObject.js";
const GRAVITY_ACCELERATION = -800;

export default class MobileObject extends GameObject {
    constructor(x, y, width, height, color, walkAccel, jumpSpeed) {
        super(x, y, width, height, color);
        this.walkAccel = walkAccel;
        this.jumpSpeed = jumpSpeed;
        this.standingOn = null;
        this.accelX = 0;
        this.dead = false;
        this.active = true;
    }
    step(dt, input) {
        // Bounds
        if (this.y < -this.height) {this.active = false;}
        
        // Gravity
        this.checkFloor();
        this.speedX += this.accelX * dt;
        if (!this.standingOn) {
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

       
    }
    jump() {
        if (this.standingOn) {
            this.speedY = this.jumpSpeed;
            this.standingOn = null;
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
                return {time, side};                
            }
        }
        return false;
    }
        
    collide(object) {
        if (this.dead || object.dead) {return;}
        if (this === object) {return;}
        const collision = this.collisionDetection(object);
        if (collision) {
            const {time, side} = collision;

            // Move objects to time of collision (time is negative)
            this.x += this.speedX * time;
            this.y += this.speedY * time;
            object.x += object.speedX * time;
            object.y += object.speedY * time;
            // console.log(side)
            
            // console.log(this.speedY)
            // console.log(this.standingOn)
            this.resolveColission(object, side);
            const oppositeSide = {"top": "bottom", "bottom": "top", "left": "right", "right": "left"}[side];
            object.resolveColission(this, oppositeSide);
            // console.log(this.speedY)
            // console.log(this.standingOn)

            // Move objects to time of rest
            this.x += this.speedX * -time;
            this.y += this.speedY * -time;
            object.x += object.speedX * -time;
            object.y += object.speedY * -time;
        }
    }
    checkFloor() {
        if (this.standingOn) {
            if (this.x + this.width < this.standingOn.x || this.x > this.standingOn.x + this.standingOn.width) {
                this.standingOn = null;
            }
        }
    }
    die() {
        this.dead = true;
        this.accelX = -200;
        this.speedX = -20;
        this.standingOn = true;
        this.jump();
    }
}