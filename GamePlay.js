const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
import { HardObject } from "./GameObjects/StaticObjects.js";
import MobileObject from "./GameObjects/MobileObject.js";
// SCREEN INITIALIZATION AND RESIZING

import SCREEN from "./screen.js";

const CAMERA_EDGE_RIGHT = 0.4;
const CAMERA_EDGE_LEFT = 0.2;
export class Map {
    constructor(mainObject, mobileObjects, stationaryObjects) {
        this.mainObject = mainObject;
        this.objects = [...mobileObjects, ...stationaryObjects];
        this.objects.forEach((object) => {object.getChildObjects().forEach((child) => this.objects.push(child))});
        this.camera = {x: 0, y: 0, zoom: 26, screen: SCREEN}; // Zoom defines the number of units in width that the camera can see
    }
    draw() {
        this.trackMainObject()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const activeObjects = this.objects.filter((object) => object.active);
        activeObjects.forEach((object) => {object.draw(ctx, this.camera)});
        this.mainObject.draw(ctx, this.camera);
        // Draw text 
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`x: ${this.mainObject.x.toFixed(2)}, y: ${this.mainObject.y.toFixed(2)}`, 10, 50);
        ctx.fillText(`FPS: ${this.fps}`, 10, 100);
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
    step(dt, input, time) {
        this.fps = Math.round(1 / dt /10)* 10 ;
        this.mainObject.step(dt, input, time);
        // Step for active Objects
        const activeObjects = this.objects.filter((object) => object.active);
        activeObjects.forEach((object) => {object.step(dt, time)});
        // Collision detection
        const mobileObjects = [this.mainObject, ...activeObjects.filter((object) => object instanceof MobileObject)]
        const collidableObjects = [
            ...mobileObjects,
            ...activeObjects.filter((object) => object instanceof HardObject)
        ];
        // const collidableObjects = [this.mainObject, ...this.activeMobileObjects, ...this.stationaryObjects.filter((object) => object instanceof HardObject)];
        mobileObjects.forEach((object1) => { collidableObjects.forEach((object2) => {object1.collide(object2)})});
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

export class Game {
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
                event.preventDefault();
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
            const elapsed = (timestamp - startTimestamp) / 1000;
            stepStartTimestamp = timestamp;
            const do_not_exit = gameMap.step(dt, input, elapsed);
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