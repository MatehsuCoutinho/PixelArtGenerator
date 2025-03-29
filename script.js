let container = document.querySelector('.container');
let gridButton = document.getElementById('.submit-grid');
let clearGridButton = document.getElementById('.clear-grid');
let gridWidth = document.getElementById('.width-range');
let gridHeight = document.getElementById('.height-range');
let colorButton = document.getElementById('.color-input');
let eraseBtn = document.getElementById('.erase-btn');
let paintBtn = document.getElementById('.paint-btn');
let widthValue = document.getElementById('.width-range');
let heightValue = document.getElementById('.height-range');

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "toutchstart",
        move: "toutchmove",
        up: "toutchand",
    },
};

let deviceType = "";

let draw = false;
let erase = false;

const isToutchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "toutch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isToutchDevice();

gridButton.addEventListener('click', () => {
    container.innerHTML = "";
    let count = 0;
    for (let i = 0; i < gridHeight.ariaValueMax; i++) {
        count += 2;
        let div = document.createEvent('div');
        div.classList.add('gridRow');
        for (let j = 0; i < gridWidth.ariaValueMax; i++) {
        count += 2;
        let col = document.createEvent('div');
        col.classList.add('gridCol');
        col.setAttribute
        }
    }
})