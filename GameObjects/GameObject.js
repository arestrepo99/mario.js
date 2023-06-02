import { clock } from "../GamePlay.js";

export default class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.intervals = []
        this.clock = clock;
        this.active = false;
    }

    wait(waitTime, func, repeat = false) {
        this.intervals.push({ waitTime, func, startTime: this.clock.time, repeat });
    }

    getChildObjects() {
        return [];
    }

    activate() {
        this.active = true;
    }

    runIntervals() {
        this.intervals.forEach((interval) => {
            const { waitTime, func, startTime } = interval;
            if (this.clock.time - startTime > waitTime) {
                func();
                if (!interval.repeat) {
                    this.intervals.splice(this.intervals.indexOf(interval), 1);
                } else {
                    interval.startTime = this.clock.time;
                }

            }
        });
    }

    step(dt){
        this.runIntervals();
    }

    getPositionInCtx(camera){
        const {width, height, aspectRatio} = camera.screen;
        return {
            x: (this.x - camera.x) * width / (camera.zoom),
            y: height - ((this.y - camera.y) * height / (camera.zoom / aspectRatio)) - (this.height * height / (camera.zoom / aspectRatio)),
            width: this.width * width / (camera.zoom),
            height: this.height * height / (camera.zoom / aspectRatio)
        }
    }

    draw(ctx, camera) {
        
        if (!this.tilemap) {
            return this.drawFill(ctx, camera);
        }
        
        const {x, y, width, height} = this.getPositionInCtx(camera)
        const {x: sx, y: sy, w: sw, h: sh} = this.getRenderSection();
        ctx.drawImage(
            this.tilemap,
            // Select section
            sx, sy, sw, sh,
            // Draw section of tilemap
            x, y, width, height
        )
    }

    drawFill(ctx, camera) {
        ctx.fillStyle = "red";
        const {x, y, width, height} = this.getPositionInCtx(camera);
        ctx.fillRect(
            x,
            y,
            width,
            height
        );
    }
    resolveColission(object, side) {}
    
}