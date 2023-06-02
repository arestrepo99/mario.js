const HORIZONTAL_MARGIN = 40;
let VERTICAL_MARGIN = window.innerWidth / 3 + 40;


let MOBILE = (navigator.userAgent.match(/Android/i)
|| navigator.userAgent.match(/webOS/i)
|| navigator.userAgent.match(/iPhone/i)
|| navigator.userAgent.match(/iPad/i)
|| navigator.userAgent.match(/iPod/i)
|| navigator.userAgent.match(/BlackBerry/i)
|| navigator.userAgent.match(/Windows Phone/i))

if (!MOBILE) {
    // remove buttons
    document.getElementById("buttons").remove();
    VERTICAL_MARGIN = 140;
}

const MAX_ASPECT_RATIO = 1.3;

const SCREEN = {
    width: window.innerWidth - HORIZONTAL_MARGIN,
    height: window.innerHeight - VERTICAL_MARGIN,
    aspectRatio: window.innerWidth / window.innerHeight,
}

const left = document.getElementById("left");
const right = document.getElementById("right");
const up = document.getElementById("up");
const action = document.getElementById("action");

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


    if (MOBILE){
        const v_left = 8;
        const v_right = SCREEN.width + 8;
        const v_top = SCREEN.height + 16;
        const v_bottom = SCREEN.height * (1 + 1/3) + 16;

        const v_middleHeight = SCREEN.height / (3);
        const v_middleWidth = SCREEN.width / 2;

        const padding = 4;

        left.style.left = v_left + "px";
        left.style.top = v_top + "px";
        left.style.width = v_middleWidth/2 - padding + "px";
        left.style.height = v_middleHeight + "px";

        right.style.left = v_left + v_middleWidth/2 + padding + "px";
        right.style.top = v_top + "px";
        right.style.width = v_middleWidth/2 + - 2 * padding + "px";
        right.style.height = v_middleHeight + "px";

        up.style.left = v_left + v_middleWidth + padding + "px";
        up.style.top = v_top + "px";
        up.style.width = v_middleWidth + - padding + "px";
        up.style.height = v_middleHeight/2 - padding + "px";

        action.style.left = v_left + v_middleWidth + padding + "px";
        action.style.top = v_top + SCREEN.height / (3*2) + padding + "px";
        action.style.width = v_middleWidth - padding + "px";
        action.style.height = v_middleHeight/2 - padding + "px";
}

}

// Set canvas size
resize();
// Listen for chagnes
window.addEventListener("resize", resize);

export default SCREEN;