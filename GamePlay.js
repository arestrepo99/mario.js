const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
import { HardObject } from "./GameObjects/StaticObjects.js";
import MobileObject from "./GameObjects/MobileObject.js";
// SCREEN INITIALIZATION AND RESIZING

import SCREEN from "./screen.js";

const CAMERA_EDGE_RIGHT = 0.4;
const CAMERA_EDGE_LEFT = 0.2;

class Clock {
    start() {
        this.startTime = window.performance.now();
        this.time = 0
        this.stepStartTime = this.startTime
        this.lastFpsUpdate = 0
        this.fps = 0
    }
    update(timestamp) { 
        const dt = (timestamp - this.stepStartTime) / 1000;
        this.stepStartTime = timestamp;
        this.time = (timestamp - this.startTime) / 1000;
        // Update FPS 2 times per second
        if (this.time - this.lastFpsUpdate > 0.5) {
            this.fps = 1 / dt;
            this.lastFpsUpdate = this.time;
        }
        if (dt > 0.05) {
            return 0;
        }
        return dt;
    }

}
export const clock = new Clock();

export class Map {
    constructor(mainObject, mobileObjects, stationaryObjects, end) {
        this.mainObject = mainObject;
        this.objects = [...stationaryObjects, ...mobileObjects, end];
        this.end = end;
        this.objects.forEach((object) => object.activate());
        this.objects.forEach((object) => {object.getChildObjects().forEach((child) => this.objects.push(child))});
        this.camera = {x: 0, y: 0, zoom: 25, screen: SCREEN}; // Zoom defines the number of units in width that the camera can see
    }

    getActiveObjects() {
        const activeObjects = this.objects.filter((object) => object.active);
        activeObjects.forEach((object) => {object.draw(ctx, this.camera)});
        return activeObjects.filter((object) => 
            object.x + object.width > this.camera.x - 5 && object.x < this.camera.x + this.camera.zoom + 5
            
        );
    }



    draw() {
        this.trackMainObject()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.getActiveObjects().forEach((object) => {object.draw(ctx, this.camera)});
        this.mainObject.draw(ctx, this.camera);
        // Draw text 
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(`x: ${this.mainObject.x.toFixed(2)}, y: ${this.mainObject.y.toFixed(2)}`, 10, 50);
        ctx.fillText(`FPS: ${clock.fps.toFixed(0)}`, 10, 100);
        ctx.fillText(`Time: ${clock.time.toFixed(0)}`, 10, 150);
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

    evaluateActions(actions) {
        actions.forEach((action) => {
            if (action) {
                console.log(action);
                switch (action.type) {
                    case "addObject":
                        action.object.activate();
                        this.objects.push(action.object);
                        console.log("Added object");
                        break;
                }
            }
        })
    }
    
    step(dt, input) {
        const action = this.mainObject.step(dt, input);
        // Step for active Objects
        const activeObjects = this.getActiveObjects();
        const actions = [action, ...activeObjects.map((object) => {object.step(dt)})];
        this.evaluateActions(actions);
        // Collision detection
        const mobileObjects = [this.mainObject, ...activeObjects.filter((object) => object instanceof MobileObject)]
        const collidableObjects = [
            ...mobileObjects,
            ...activeObjects.filter((object) => object instanceof HardObject)
        ];
        // const collidableObjects = [this.mainObject, ...this.activeMobileObjects, ...this.stationaryObjects.filter((object) => object instanceof HardObject)];
        mobileObjects.forEach((object1) => { collidableObjects.forEach((object2) => {object1.collide(object2)})});
        if (this.mainObject.x > this.end.x) {
            return {'continue': false, 'win': true}
        }
        return {'continue': this.mainObject.active, 'win': false}
    }
}


const keysToActions = {
    "ArrowLeft": "left",
    "ArrowRight": "right",
    "ArrowUp": "up",
    "ArrowDown": "down",
    " ": "up",
    "Shift": "action",
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
            event.target.classList.add("active");
        });
        window.addEventListener("touchend", (event) => {
            this.input[event.target.id] = false;
            event.target.classList.remove("active");
        });
    }

    start() {
        // let startTimestamp = ;
        
        const gameMap = this.gameMap;
        this.startListeningForInput();
        const input = this.input;
        clock.start();
        function loop(timestamp) {
            const dt = clock.update(timestamp);
            // const dt = (timestamp - stepStartTimestamp) / 1000;
            // const elapsed = (timestamp - startTimestamp) / 1000;
            // stepStartTimestamp = timestamp;
            const output = gameMap.step(dt, input);
            gameMap.draw();
            if (output.continue) {
                window.requestAnimationFrame(loop);
            } else {
                // Draw large text saying Game OVER
                ctx.fillStyle = "Black";
                console.log(gameMap.camera.screen.width)
                ctx.font = `${gameMap.camera.screen.width/16}px Arial`;
                if (output.win){
                    ctx.fillText(`You Win!`, gameMap.camera.screen.width/3, gameMap.camera.screen.height / 10);
                } else {
                    ctx.fillText(`Game Over`, gameMap.camera.screen.width/3, gameMap.camera.screen.height / 10);
                }
                window.requestAnimationFrame(() => {  });
            }
        }
        window.requestAnimationFrame(loop);
    }
}