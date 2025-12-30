/* ================= GAME STATE VARIABLES ================= */
let gameStarted = false; // Game locked until mode selected
let gameEnded = false;
let controlMode = null; // "touch" or "keyboard"

let score = 0;
let cross = true;
let firstInteraction = false;


/* ================= DOM ELEMENT REFERENCES ================= */
let Ninja = document.querySelector(".ninja");
let Dragon = document.querySelector(".dragon");
let gameover = document.querySelector(".gameover");
let myscore = document.querySelector(".score");
const reloadBtn = document.getElementById("reloadBtn");

const popup = document.getElementById("modePopup");
const touchBtn = document.getElementById("touchMode");
const keyboardBtn = document.getElementById("keyboardMode");

const btnUp = document.getElementById("up");
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");


/* ================= AUDIO FILES ================= */
let Ninjaaudio = new Audio("NinjaBackgroundmusic.mp3");
let jumpAudio = new Audio("Jump.mp3");
let EndAudio = new Audio("GameOver.mp3");


/* ================= INITIAL UI SETUP ================= */
document.querySelector(".controls").style.display = "none";
Ninja.classList.remove("animateninja");


/* ================= CONTROL MODE SELECTION ================= */
touchBtn.onclick = () => {
    controlMode = "touch";
    document.querySelector(".controls").style.display = "flex";
    popup.style.display = "none";

    Dragon.classList.add("animatedragon");
    gameStarted = true;
};

keyboardBtn.onclick = () => {
    controlMode = "keyboard";
    document.querySelector(".controls").style.display = "none";
    popup.style.display = "none";

    Dragon.classList.add("animatedragon");
    gameStarted = true;
};


/* ================= TOUCH & MOUSE CONTROLS ================= */
btnUp.addEventListener("touchstart", (e) => {
    if (controlMode !== "touch") return;
    e.preventDefault();
    jumpNinja();
});

btnLeft.addEventListener("touchstart", (e) => {
    if (controlMode !== "touch") return;
    e.preventDefault();
    moveLeft();
});

btnRight.addEventListener("touchstart", (e) => {
    if (controlMode !== "touch") return;
    e.preventDefault();
    moveRight();
});

btnUp.addEventListener("click", () => {
    if (controlMode !== "touch") return;
    jumpNinja();
});

btnLeft.addEventListener("click", () => {
    if (controlMode !== "touch") return;
    moveLeft();
});

btnRight.addEventListener("click", () => {
    if (controlMode !== "touch") return;
    moveRight();
});


/* ================= CORE GAME FUNCTIONS ================= */
function handleFirstInteraction() {
    if (!firstInteraction) {
        Ninjaaudio.loop = true;
        Ninjaaudio.play().catch(() => { });
        firstInteraction = true;
    }
}

function jumpNinja() {
    handleFirstInteraction();
    if (gameEnded) return;

    if (!Ninja.classList.contains("animateninja")) {
        Ninja.classList.add("animateninja");
        jumpAudio.play();
        setTimeout(() => {
            Ninja.classList.remove("animateninja");
        }, 600);
    }
}

function moveLeft() {
    handleFirstInteraction();
    if (gameEnded) return;

    let ninjaX = parseInt(getComputedStyle(Ninja).left);
    Ninja.style.left = Math.max(0, ninjaX - 80) + "px";
}

function moveRight() {
    handleFirstInteraction();
    if (gameEnded) return;

    let ninjaX = parseInt(getComputedStyle(Ninja).left);
    Ninja.style.left = Math.min(window.innerWidth - 150, ninjaX + 80) + "px";
}


/* ================= KEYBOARD CONTROLS ================= */
document.onkeydown = function (e) {
    if (!gameStarted || gameEnded) return;

    if (e.keyCode === 38) jumpNinja();
    if (e.keyCode === 37) moveLeft();
    if (e.keyCode === 39) moveRight();
};


/* ================= GAME LOOP & COLLISION ================= */
setInterval(() => {
    if (!gameStarted || gameEnded) return;

    let NX = parseInt(getComputedStyle(Ninja).left);
    let NY = parseInt(getComputedStyle(Ninja).top);

    let DX = parseInt(getComputedStyle(Dragon).left);
    let DY = parseInt(getComputedStyle(Dragon).top);

    let offsetX = Math.abs(NX - DX);
    let offsetY = Math.abs(NY - DY);

    if (offsetX < 73 && offsetY < 52) {
        gameover.style.display = "block";
        gameover.innerHTML = "GAME OVER";
        document.getElementById("reloadBtn").style.display = "block";
        gameEnded = true;

        Dragon.style.animation = "none";
        Dragon.style.left = DX + "px";

        Ninjaaudio.pause();
        EndAudio.play();
    }
    else if (offsetX < 50 && cross) {
        score++;
        updatescore(score);
        cross = false;
        setTimeout(() => cross = true, 1000);
    }
}, 10);


/* ================= SCORE & RESTART ================= */
function updatescore(score) {
    myscore.innerHTML = "<b>Your Score: " + score + "</b>";
}

reloadBtn.addEventListener("click", () => {
    location.reload();
});
