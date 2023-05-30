const HORIZONTAL_MARGIN = 40;
let VERTICAL_MARGIN = window.innerWidth / 3 + 40;


const MOBILE = false;
if (!MOBILE) {
    VERTICAL_MARGIN = 140;
}

const MAX_ASPECT_RATIO = 1.3;

const SCREEN = {
    width: window.innerWidth - HORIZONTAL_MARGIN,
    height: window.innerHeight - VERTICAL_MARGIN,
    aspectRatio: window.innerWidth / window.innerHeight,
}

function resize() {
    SCREEN.width = window.innerWidth - HORIZONTAL_MARGIN;
    SCREEN.height = window.innerHeight - VERTICAL_MARGIN;
    SCREEN.aspectRatio = SCREEN.width / SCREEN.height;
    if (SCREEN.aspectRatio > MAX_ASPECT_RATIO) {
        SCREEN.aspectRatio = MAX_ASPECT_RATIO;
        SCREEN.width = SCREEN.height * SCREEN.aspectRatio;
    }
    if (SCREEN.aspectRatio < 1/MAX_ASPECT_RATIO) {
        SCREEN.aspectRatio = 1/MAX_ASPECT_RATIO;
        SCREEN.height = SCREEN.width / SCREEN.aspectRatio;
    }
    canvas.setAttribute("width", SCREEN.width);
    canvas.setAttribute("height", SCREEN.height);
}

// Set canvas size
resize();
// Listen for chagnes
window.addEventListener("resize", resize);

export default SCREEN;