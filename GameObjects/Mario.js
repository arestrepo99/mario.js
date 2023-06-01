import MobileObject from './MobileObject.js';

const tilemap = new Image();
tilemap.src = "tilemaps/mario.png";

const MARIOACCEL = 100;
const MARIOJUMPSPEED = 30;

const renderSectionMap = {
    'small': {
        'idle': {'x':0, 'y':0, 'w':16, 'h':16},
        'walk': [{'x':16, 'y':0, 'w':16, 'h':16}, {'x':32, 'y':0, 'w':16, 'h':16}, {'x':48, 'y':0, 'w':16, 'h':16}],
        'break': {'x':64, 'y':0, 'w':16, 'h':16},
        'jump': {'x':80, 'y':0, 'w':16, 'h':16},
        'dead': {'x':96, 'y':0, 'w':16, 'h':16},
    },
    'big': {
        'idle': {'x':0, 'y':16, 'w':16, 'h':32},
        'walk': [{'x':16, 'y':16, 'w':16, 'h':32}, {'x':32, 'y':16, 'w':16, 'h':32}, {'x':48, 'y':16, 'w':16, 'h':32}],
        'break': {'x':64, 'y':16, 'w':16, 'h':32},
        'jump': {'x':80, 'y':16, 'w':16, 'h':32},
        'dead': {'x':96, 'y':16, 'w':16, 'h':32},
    },
}


export default class Mario extends MobileObject {
    constructor(x, y) {
        super(x, y, 16/16, 32/16, MARIOACCEL, MARIOJUMPSPEED);
        this.mode = 'big';
        this.printedTime = 0;

        // this.runAfterInterval(1, () => {
        //     console.log(this.x, this.y);
        // }, true);
    }

    step(dt, input, time) {
        this.input = input; // Save input for rendering
        super.step(dt, input, time);
        // if (this.immune) {
        //     // Be inmune for 2 seconds
        //     if (this.time - this.immune.start > 2) {
        //         this.immune = null;
        //     }
        // }
    }

    getRenderSection() {
        let section
        let breaking = false;
        if (this.dead) {
            section = renderSectionMap[this.mode]['dead'];
        } else if (this.freeFall()) {
            section = renderSectionMap[this.mode]['jump'];
        } else if (this.speedX > 10) {
            if (!this.input['right']) {
                section = renderSectionMap[this.mode]['break'];
                breaking = true;
            } else {
                section = renderSectionMap[this.mode]['walk'][Math.floor(this.time * 10) % 3];
            }
        } else if (this.speedX < -10) {
            if (!this.input['left']) {
                section = renderSectionMap[this.mode]['break'];
                breaking = true;
            } else {
                section = renderSectionMap[this.mode]['walk'][Math.floor(this.time * 10) % 3];
            }
        } else {
            section = renderSectionMap[this.mode]['idle'];
        }
        if (this.lookingDirection == 'left') {
            if (!breaking) {
                section = { x : section['x'] + 16*7, y : section['y'], w : section['w'], h : section['h'] };
            }
        } else {
            if (breaking) {
                section = { x : section['x'] + 16*7, y : section['y'], w : section['w'], h : section['h'] };
            }
        }
        return section;
    }


    draw(ctx, camera) {

        if (this.immune) {
            // Blink every 0.1 seconds
            if (Math.floor(this.time * 10) % 2 == 0) {
                return;
            }
        }
        const {x, y, width, height} = this.getPositionInCtx(camera)
        const {x: sx, y: sy, w: sw, h: sh} = this.getRenderSection();
        ctx.drawImage(
            tilemap,
            // Select section
            sx, sy, sw, sh,
            // Draw section of tilemap
            x, y, width, height
        )
    }

    die() {
        if (this.immune) {
            return;
        }
        if (this.mode == 'big') {
            this.mode = 'small';
            this.width = 1;
            this.height = 1;
            this.immune = true;
            this.runAfterInterval(2, () => {
                this.immune = false;
            });
            // this.immune = {start: this.time};
        } else {
            super.die();
        }
    }
}

