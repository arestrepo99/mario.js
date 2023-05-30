const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fps = document.getElementById("fps");
// SCREEN INITIALIZATION AND RESIZING


const CAMERA_EDGE_RIGHT = 0.4;
const CAMERA_EDGE_LEFT = 0.2;
export class Game {
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


        // Main Object Colision detection
        // this.stationaryObjects.forEach((object) => {this.mainObject.collideStatic(object)});
        // this.activeMobileObjects.forEach((object) => {this.mainObject.collideMobile(object)});

        // // Mobile Object Colision detection
        // this.activeMobileObjects.forEach((object) => {
        //     this.stationaryObjects.forEach((object2) => {object.collideStatic(object2)});
        // });

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

export class EventLoop {
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