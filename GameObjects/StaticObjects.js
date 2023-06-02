import GameObject from "./GameObject.js";
import Mario from "./Mario.js";


const tilemap = new Image();
tilemap.src = "tilemaps/map1.png";

export class StaticObject extends GameObject {
    draw(ctx, camera) {
        let {x, y, width, height} = this.getPositionInCtx(camera);
        const {x: sx, y: sy, w: sw, h: sh} = this.getRenderSection();
        const unitSize = camera.screen.width / (camera.zoom);
        for (let i = 0; i < width-1; i += unitSize) {
            for (let j = 0; j < height-1; j += unitSize) {
                ctx.drawImage(tilemap, sx, sy, sw, sh, x + i, y + j, unitSize+1, unitSize+1);
            }
        }
    }
}

export class Cloud extends StaticObject {
    constructor(x, y, width) {
        super(x, y, width, 2);
    }

    getRenderSection(){
        return {
            leftTop: {x: 16*4, y: 0, w: 16, h: 16},
            middleTop: {x: 16*5, y: 0, w: 16, h: 16},
            rightTop: {x: 16*6, y: 0, w: 16, h: 16},
            leftBottom: {x: 16*4, y: 16, w: 16, h: 16},
            middleBottom: {x: 16*5, y: 16, w: 16, h: 16},
            rightBottom: {x: 16*6, y: 16, w: 16, h: 16},
        }
    }
    
    draw(ctx, camera) {
        const {x, y, width, height} = this.getPositionInCtx(camera);
        const {leftTop, middleTop, rightTop, leftBottom, middleBottom, rightBottom} = this.getRenderSection();
        const unitSize = camera.screen.width / (camera.zoom);
        // x = x - unitSize/2;
        // Left top corner
        ctx.drawImage(tilemap, leftTop.x, leftTop.y, leftTop.w, leftTop.h, x, y, unitSize+1, unitSize+1);
        // Left bottom corner
        ctx.drawImage(tilemap, leftBottom.x, leftBottom.y, leftBottom.w, leftBottom.h, x, y + height - unitSize, unitSize+1, unitSize+1);
        // Right top corner
        ctx.drawImage(tilemap, rightTop.x, rightTop.y, rightTop.w, rightTop.h, x + width - unitSize, y, unitSize+1, unitSize+1);
        // Right bottom corner
        ctx.drawImage(tilemap, rightBottom.x, rightBottom.y, rightBottom.w, rightBottom.h, x + width - unitSize, y + height - unitSize, unitSize+1, unitSize+1);
        
        // Iter Middle 
        for (let i = 1; i < this.width - 1; i += 1) {
            ctx.drawImage(tilemap, middleTop.x, middleTop.y, middleTop.w, middleTop.h, x + i*unitSize, y, unitSize+1, unitSize+1);
            ctx.drawImage(tilemap, middleBottom.x, middleBottom.y, middleBottom.w, middleBottom.h, x + i*unitSize, y + height - unitSize, unitSize+1, unitSize+1);
        }
    }

}

export class Bush extends StaticObject {
    constructor(x, y, width) {
        super(x, y, width, 1);
    }

    getRenderSection(){
        return {
            left: {x:3*16, y:2*16, w:16, h:16},
            middle: {x:4*16, y:2*16, w:16, h:16},
            right: {x:5*16, y:2*16, w:16, h:16},
        }
    }

    draw(ctx, camera) {
        const {x, y, width, height} = this.getPositionInCtx(camera);
        const {left, middle, right} = this.getRenderSection();
        const unitSize = camera.screen.width / (camera.zoom);
        // Left
        ctx.drawImage(tilemap, left.x, left.y, left.w, left.h, x, y, unitSize+1, unitSize+1);
        // Right
        ctx.drawImage(tilemap, right.x, right.y, right.w, right.h, x + width - unitSize, y, unitSize+1, unitSize+1);
        // Iter Middle
        for (let i = unitSize; i < width - unitSize; i += unitSize) {
            ctx.drawImage(tilemap, middle.x, middle.y, middle.w, middle.h, x + i, y, unitSize+1, unitSize+1);
        }
    }
}

export class BackgroundHill extends StaticObject {
    constructor(x, y, height) {
        super(x, y, null, height);
    }

    getRenderSection(){
        return {
            top: {x:6*16, y:2*16, w:16, h:16},
            left: {x:5*16, y:3*16, w:16, h:16},
            middle: {x:6*16, y:3*16, w:16, h:16},
            right: {x:7*16, y:3*16, w:16, h:16},
        }
    }

    draw(ctx, camera) {
        let {x, y, width, height} = this.getPositionInCtx(camera);
        const {top, left, middle, right} = this.getRenderSection();
        const unitSize = camera.screen.width / (camera.zoom);
        y = y + height;
        // Top
        ctx.drawImage(tilemap, top.x, top.y, top.w, top.h, x, y, unitSize+1, unitSize+1);
        // Iterate down the trianglular shape
        for (let i = this.height-1; i > 0; i--) {
            // Draw left
            ctx.drawImage(tilemap, left.x, left.y, left.w, left.h, x - i*unitSize, y + i*unitSize, unitSize+1, unitSize+1);
            // Draw right
            ctx.drawImage(tilemap, right.x, right.y, right.w, right.h, x + width + i*unitSize, y + i*unitSize, unitSize+1, unitSize+1);
            // Iter middle
            const middleSideExtention = this.height - i;
            for (let j = -middleSideExtention +1 ; j < middleSideExtention; j++) {
                ctx.drawImage(tilemap, middle.x, middle.y, middle.w, middle.h, x + j*unitSize, y + (this.height-i)*unitSize, unitSize, unitSize);
            }
        }
    }
}

export class JumpingCoin extends StaticObject {
    constructor(x, y) {
        super(x, y, 1, 1) ;
    }

    step(dt) {
        super.step(dt);
        this.y += 2*dt;
    }

    activate() {   
        super.activate();
        this.wait(0.1, () => {
            this.active = false;
        });
    }

    getRenderSection(){
        return {x:3*16, y:3*16, w:16, h:16};
    }
}




export class HardObject extends StaticObject {


    hitBottom(player) {}

    hitTop(player) {}

    resolveColission(object, side) {
        if (object instanceof Mario) {
            switch (side) {
                case 'bottom':
                    this.hitBottom(object);
                    break;
                case 'top':
                    this.hitTop(object);
                    break;
            }
        }
    }
}

export class Rock extends HardObject {
    getRenderSection(){
        return {x:16, y:16, w:16, h:16};
    }
}

export class Brick extends HardObject {
    getRenderSection(){
        return {x:16, y:0, w:16, h:16};
    }

    hitBottom(player) {
        if (player.mode = 'big') {
            this.active = false;
            // this.parent.add(new JumpingCoin(this.x, this.y));
        }
    }

}

export class QuestionBlock extends HardObject {
    constructor(x, y, width, height, content) {
        super(x, y, width, height);
        this.content = content;
        this.content.active = false;
    }

    getChildObjects() {
        return [this.content];
    }

    getRenderSection(){
        if (!this.opened) {
            return {x:0, y:0, w:16, h:16};
        } else {
            return {x:4*16, y:3*16, w:16, h:16};
        }
    }
    
    open(direction){
        if (this.opened) { return; }
        this.opened = true;
        this.content.x = this.x;
        if (direction === 1) {
            this.content.y = this.y + this.content.height;
        } else {
            this.content.y = this.y - this.height - this.content.height + 1;
        }
        this.content.activate();
        this.opening = {openStart: this.clock.time, direction};
    } 

    hitBottom(player) {
        this.open(1);
    }

    hitTop(player) {
        if (player.mode=='big' && player.input.down) {
            this.open(-1);
        }
    }

    getPositionInCtx(camera) {
        let {x, y, width, height} = super.getPositionInCtx(camera);
        const unitSize = camera.screen.width / (camera.zoom);
        // Opening animation
        if (this.opening) {
            const timeSinceOpen = this.clock.time - this.opening.openStart;
            const offset = this.opening.direction * Math.sin(timeSinceOpen * 2 * Math.PI / 0.2) * 0.2  * unitSize;
            if (offset < 0) { 
                this.opening = false; 
            } else {
                y = y - offset;
            }
        }
        return {x, y, width, height};
    }

}

export class HardBlock extends HardObject {
    getRenderSection(){
        return {x:0, y:16, w:16, h:16};
    }
}

export class Pipe extends HardObject {
    constructor(x, y, height) {
        super(x, y, 2, height);
    }

    getRenderSection(){
        return {
            tl: {x: 16*2, y: 0, w: 16, h: 16},
            tr: {x: 16*3, y: 0, w: 16, h: 16},
            bl: {x: 16*2, y: 16, w: 16, h: 16},
            br: {x: 16*3, y: 16, w: 16, h: 16},
        }
    }
    draw(ctx, camera) {
        const {x, y, width, height} = this.getPositionInCtx(camera);
        const {tl, tr, bl, br} = this.getRenderSection();
        const unitSize = camera.screen.width / (camera.zoom);
        ctx.drawImage(tilemap, tl.x, tl.y, tl.w, tl.h, x, y, unitSize+1, unitSize+1);
        ctx.drawImage(tilemap, tr.x, tr.y, tr.w, tr.h, x + unitSize, y, unitSize+1, unitSize+1);
        // Iterate starting at x - unitSize, to x - height, by unitSize
        for (let iHeight = 1; iHeight < height - unitSize; iHeight += unitSize) {
            ctx.drawImage(tilemap, bl.x, bl.y, bl.w, bl.h, x, y + unitSize + iHeight, unitSize+1, unitSize+1);
            ctx.drawImage(tilemap, br.x, br.y, br.w, br.h, x + unitSize, y + unitSize + iHeight, unitSize+1, unitSize+1);

        }

    }

}