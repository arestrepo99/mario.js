import { Game, clock } from "../GamePlay.js";
import GameObject from "./GameObject.js";

import {HardBlock} from './StaticObjects.js'
const tilemap = new Image();
tilemap.src = "tilemaps/map1.png";

export default class End extends GameObject {
    // 198, 2
    constructor(x, y) {
        super(x, y, 1, 1);
        this.tilemap = tilemap;
    }

    getChildObjects(){
        const block = new HardBlock(this.x, this.y,1,1);
        block.activate();
        return [block];
    }
    getRenderSection(){
        return {
            flag: {x: 7*16, y: 0, w:  2*16, h: 3*16},
            pole: {x: 8*16, y: 3*16,  w:16, h:16},
            castle: {x: 9*16, y: 0, w: 5*16, h: 5*16}
        }
    }

    draw(ctx, camera) {
        const {flag, pole, castle} = this.getRenderSection();
        const {x: xf, y: yf, w: wf, h: hf} = flag;
        const {x: xp, y: yp, w: wp, h: hp} = pole;
        const {x: xc, y: yc, w: wc, h: hc} = castle;
        // const {x, y} = this.getPositionInCtx(camera);
        const unitSize = camera.screen.width / (camera.zoom);
        const flagHeight = 11

        const {x, y, width, height} = this.getPositionInCtx(camera)
        ctx.drawImage(
            this.tilemap,
            // Select section
            xf, yf, wf, hf,
            // Draw section of tilemap
            x - 1*width, y-(flagHeight-1)*unitSize, width*2, height*3
        )
        // // Draw pole
        for (let i = 0; i < flagHeight-4; i++) {
            ctx.drawImage(
                tilemap,
                xp, yp, wp, hp,
                x, y - (i+1)*unitSize, width, height        
            );
        }
        // Draw castle
        ctx.drawImage(
            this.tilemap,
            // Select section
            xc, yc, wc, hc,
            // Draw section of tilemap
            x + 4*unitSize, y - 4*unitSize, width*5, height*5
        )
            
        // );
    }

    
}