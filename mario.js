const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fps = document.getElementById("fps");
// SCREEN INITIALIZATION AND RESIZING



const HORIZONTAL_MARGIN = 40;
let VERTICAL_MARGIN = window.innerWidth / 3 + 40;


const MOBILE = false;
if (!MOBILE) {
    VERTICAL_MARGIN = 140;
}

const MAX_ASPECT_RATIO = 1.3;

const SCREEN = {
    width: window.innerWidth - HORIZONTAL_MARGIN,
    height: window.innerHeight - VERTICAL_MARGIN,
    aspectRatio: window.innerWidth / window.innerHeight,
}

function resize() {
    SCREEN.width = window.innerWidth - HORIZONTAL_MARGIN;
    SCREEN.height = window.innerHeight - VERTICAL_MARGIN;
    SCREEN.aspectRatio = SCREEN.width / SCREEN.height;
    if (SCREEN.aspectRatio > MAX_ASPECT_RATIO) {
        SCREEN.aspectRatio = MAX_ASPECT_RATIO;
        SCREEN.width = SCREEN.height * SCREEN.aspectRatio;
    }
    if (SCREEN.aspectRatio < 1/MAX_ASPECT_RATIO) {
        SCREEN.aspectRatio = 1/MAX_ASPECT_RATIO;
        SCREEN.height = SCREEN.width / SCREEN.aspectRatio;
    }
    canvas.setAttribute("width", SCREEN.width);
    canvas.setAttribute("height", SCREEN.height);
}

// Set canvas size
resize();
// Listen for chagnes
window.addEventListener("resize", resize);

const ACCELERATION = -800;

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
    }
    draw(camera) {
        ctx.fillStyle = this.color;
        const x = (this.x - camera.x) * SCREEN.width / (camera.zoom)
        const y = (this.y - camera.y) * SCREEN.height / (camera.zoom / SCREEN.aspectRatio)
        const width = this.width * SCREEN.width / (camera.zoom)
        const height = this.height * SCREEN.height / (camera.zoom / SCREEN.aspectRatio)

        ctx.fillRect(
            x,
            SCREEN.height - y - height,
            width + 1,
            height + 1
        );
    }
    resolveColission(object, side) {}
    
}

class StaticObject extends GameObject {
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

class MobileObject extends GameObject {
    constructor(x, y, width, height, color, walkAccel, jumpSpeed) {
        super(x, y, width, height, color);
        this.walkAccel = walkAccel;
        this.jumpSpeed = jumpSpeed;
        this.standingOn = null;
        this.accelX = 0;
        this.active = true;
    }
    step(dt, input) {
        if (input.up) {this.jump();}
        if (input.left) {this.accelX = -this.walkAccel;}
        else if (input.right) {this.accelX = this.walkAccel;}
        else {this.accelX = 0;}
        // Gravity
        this.checkFloor();
        this.speedX += this.accelX * dt;
        if (!this.standingOn) {
            this.speedY += ACCELERATION * dt;
        }
        // Friction
        this.speedX *= 0.9;
            
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
        this.active = false;
    }
}


const MARIOACCEL = 700;
const MARIOJUMPSPEED = 330;

class Mario extends MobileObject {
    constructor(x, y) {
        super(x, y, 10, 20, 'red', MARIOACCEL, MARIOJUMPSPEED);
    }
    step(dt, input) {
        if (this.y < 0) {this.active = false;}
        super.step(dt, input);
    }
}

class Grass extends StaticObject {
    constructor(x, y, width, height) {
        super(x, y, width, height, "green");
    }   
}

class UnbreakableBlock extends StaticObject {
    constructor(x, y, width, height) {
        super(x, y, width, height, "brown");
    }
}


class AutomatedObject extends MobileObject {

    constructor(x, y, width, height, color, walkAccel, jumpSpeed, input) {
        super(x, y, 10, 20, 'blue', TURTLE_ACCEL, TURTLE_JUMP_SPEED);
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

}



const TURTLE_ACCEL = 300;
const TURTLE_JUMP_SPEED = 200;
const TURTLE_SHELL_ACCEL = 1000;
class Turtle extends AutomatedObject {
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


const CAMERA_EDGE_RIGHT = 0.4;
const CAMERA_EDGE_LEFT = 0.2;
class Game {
    constructor(mainObject, mobileObjects, stationaryObjects) {
        this.mainObject = mainObject;
        this.mobileObjects = mobileObjects;
        this.stationaryObjects = stationaryObjects;
        this.camera = {x: 0, y: 0, zoom: 250}; // Zoom defines the number of units in width that the camera can see
    }
    draw() {
        this.trackMainObject()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.mainObject.draw(this.camera);
        this.stationaryObjects.forEach((object) => {object.draw(this.camera)});
        this.activeMobileObjects.forEach((object) => {object.draw(this.camera)});
    }
    trackMainObject() {
        // Camera movement
        if (this.mainObject.x < this.camera.x + (CAMERA_EDGE_LEFT * (this.camera.zoom))) {
            this.camera.x = this.mainObject.x - CAMERA_EDGE_LEFT * (this.camera.zoom);
        }
        if (this.mainObject.x > this.camera.x + ((1 - CAMERA_EDGE_RIGHT) * (this.camera.zoom))) {
            this.camera.x = this.mainObject.x - (1 - CAMERA_EDGE_RIGHT) * (this.camera.zoom);
        }
    }
    step(dt, input) {
        this.mainObject.step(dt, input);
        this.activeMobileObjects = this.mobileObjects.filter((object) => object.active);
        this.activeMobileObjects.forEach((object) => {object.step(dt)});

        const objects = [this.mainObject, ...this.activeMobileObjects, ...this.stationaryObjects];
        [this.mainObject, ...this.activeMobileObjects].forEach((object1) => { objects.forEach((object2) => {object1.collide(object2)})});

        return this.mainObject.active;
    }
}


const keysToActions = {
    "ArrowLeft": "left",
    "ArrowRight": "right",
    "ArrowUp": "up",
    "ArrowDown": "down",
    " ": "up",
}

class EventLoop {
    constructor(gameMap) {
        this.gameMap = gameMap;
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,
        };
    }

    startListeningForInput() {
        // Arrow keys
        window.addEventListener("keydown", (event) => {
            if (Object.keys(keysToActions).includes(event.key)) {
                this.input[keysToActions[event.key]] = true;
            }
        });
        window.addEventListener("keyup", (event) => {
            if (Object.keys(keysToActions).includes(event.key)) {
                this.input[keysToActions[event.key]] = false;
            }
        });
        // Mouse Down
        window.addEventListener("touchstart", (event) => {
            this.input[event.target.id] = true;
        });
        window.addEventListener("touchend", (event) => {
            this.input[event.target.id] = false;
        });
    }

    start() {
        let startTimestamp = window.performance.now();
        let stepStartTimestamp = startTimestamp;
        const gameMap = this.gameMap;
        this.startListeningForInput();
        const input = this.input;
        function loop(timestamp) {
            const dt = (timestamp - stepStartTimestamp) / 1000;
            fps.innerHTML = Math.round(1 / dt /10)* 10 ;
            stepStartTimestamp = timestamp;
            const do_not_exit = gameMap.step(dt, input);
            gameMap.draw();

            if (do_not_exit) {
                window.requestAnimationFrame(loop);
            } else {
                console.log("Game Over");
                window.requestAnimationFrame(() => {  });
            }
        }
        window.requestAnimationFrame(loop);
    }
}

// MAP CREATION
const MARIO = new Mario(-5, 20)
MARIO.speedY = 100;
MARIO.speedX = 10;


const toatal = new Turtle(110, 70, {right: true})
// toatal.toShell();
const MOBILEOBJECTS = [
    // new Turtle(100, 10, {left: true}),
    // new Turtle(60, 70, {right: true}),
    // new Turtle(110, 70, {right: true}),
    toatal
    // new Turtle(180, 30, {left: true}),
];
const STATICOBJECTS = [
    new Grass(0, 0, 500, 10),
    new UnbreakableBlock(60, 60, 40, 10),
    new UnbreakableBlock(110, 60+10+50, 40, 10),
    new UnbreakableBlock(160, 60, 40, 10), 
    new Grass(140, 10, 100, 10),
    // hill
    new Grass(160, 20, 80, 10),
];

const GAMEMAP = new Game(MARIO, MOBILEOBJECTS, STATICOBJECTS);

// START GAME
EVENTLOOP = new EventLoop(GAMEMAP);

EVENTLOOP.start();