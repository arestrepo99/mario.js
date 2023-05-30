// const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// SCREEN INITIALIZATION AND RESIZING
import SCREEN from "../screen.js";

export default class GameObject {
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