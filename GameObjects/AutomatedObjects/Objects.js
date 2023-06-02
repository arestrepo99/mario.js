import AutomatedObject from './AutomatedObject.js';
import Mario from '../Mario.js';

const tilemap = new Image();
tilemap.src = "tilemaps/objects.png";


export class Mushroom extends AutomatedObject {
    constructor(x, y, input) {
        super(x, y, 1, 1, 20, 30 , input);
        this.input = input;
        this.fallAtEdge = true;
        this.tilemap = tilemap;
    }


    getRenderSection() {
        return {x:0, y:0, h:16, w:16};
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof Mario) {
            if (object.mode = 'small') {
                object.big();
            }
            this.active = false;
        }
    }

}

export class Mushroom1Up extends Mushroom {
    constructor(x, y, input) {
        super(x, y, input);
        this.tilemap = tilemap;
    }

    getRenderSection() {
        return {x:0, y:0, h:16, w:16};
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof Mario) {
            object.lives += 1;
            this.active = false;
        }
    }
}

export class FireFlower extends AutomatedObject {
    constructor(x, y) {
        super(x, y, 1, 1, 0,0, {});
        this.tilemap = tilemap;
    }

    getRenderSection() {
        return [
            // All second row
            {x:16, y:16, h:16, w:16},
            {x:32, y:16, h:16, w:16},
            {x:48, y:16, h:16, w:16},
            {x:64, y:16, h:16, w:16},
        ][Math.floor(this.clock.time*10 % 3)];
    }

    resolveColission(object, side){
        super.resolveColission(object, side);
        if (object instanceof Mario) {
            object.fire();
            this.active = false;
        }
    }


}