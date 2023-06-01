export default class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.intervals = []
        this.time = 0;
        this.active = true;
    }

    runAfterInterval(waitTime, func, repeat = false) {
        this.intervals.push({ waitTime, func, startTime: this.time, repeat });
    }

    getChildObjects() {
        return [];
    }

    step(dt, time){
        this.time = time;
        // Run intervals
        this.intervals.forEach((interval) => {
            const { waitTime, func, startTime } = interval;
            if (time - startTime > waitTime) {
                func();
                if (!interval.repeat) {
                    this.intervals.splice(this.intervals.indexOf(interval), 1);
                } else {
                    interval.startTime = time;
                }

            }
        });
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