/* ================= GAME STATE VARIABLES ================= */
/* Controls overall game flow */
let gameStarted = false;     // Game locked until control mode selected
let gameEnded = false;       // Stops game after collision
let controlMode = null;      // "touch" or "keyboard"

/* Gameplay state */
let score = 0;
let cross = true;            // Prevents multiple score increments per obstacle
let firstInteraction = false; // Used to unlock audio on first user action


/* ================= DOM ELEMENT REFERENCES ================= */
/* Game characters */
let Ninja = document.querySelector(".ninja");
let Dragon = document.querySelector(".dragon");

/* UI elements */
let gameover = document.querySelector(".gameover");
let myscore = document.querySelector(".score");
const reloadBtn = document.getElementById("reloadBtn");

/* Mode selection popup */
const popup = document.getElementById("modePopup");
const touchBtn = document.getElementById("touchMode");
const keyboardBtn = document.getElementById("keyboardMode");

/* Touch control buttons */
const btnUp = document.getElementById("up");
const btnLeft = document.getElementById("left");
const btnRight = document.getElementById("right");


/* ================= AUDIO FILES ================= */
/* Background music and sound effects */
let Ninjaaudio = new Audio("NinjaBackgroundmusic.mp3");
let jumpAudio = new Audio("Jump.mp3");
let EndAudio = new Audio("GameOver.mp3");


/* ================= INITIAL UI SETUP ================= */
/* Hide touch controls until mode is selected */
document.querySelector(".controls").style.display = "none";

/* Ensure ninja starts without animation */
Ninja.classList.remove("animateninja");


/* ================= CONTROL MODE SELECTION ================= */
/* Touch mode: shows on-screen buttons */
touchBtn.onclick = () => {
    controlMode = "touch";
    document.querySelector(".controls").style.display = "flex";
    popup.style.display = "none";

    Dragon.classList.add("animatedragon");
    gameStarted = true;
};

/* Keyboard mode: hides touch buttons */
keyboardBtn.onclick = () => {
    controlMode = "keyboard";
    document.querySelector(".controls").style.display = "none";
    popup.style.display = "none";

    Dragon.classList.add("animatedragon");
    gameStarted = true;
};


/* ================= TOUCH & MOUSE CONTROLS ================= */
/* Jump button */
btnUp.addEventListener("touchstart", (e) => {
    if (controlMode !== "touch") return;
    e.preventDefault();
    jumpNinja();
});

/* Move left */
btnLeft.addEventListener("touchstart", (e) => {
    if (controlMode !== "touch") return;
    e.preventDefault();
    moveLeft();
});

/* Move right */
btnRight.addEventListener("touchstart", (e) => {
    if (controlMode !== "touch") return;
    e.preventDefault();
    moveRight();
});

/* Mouse click support for touch buttons */
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
/* Starts background music on first user interaction */
function handleFirstInteraction() {
    if (!firstInteraction) {
        Ninjaaudio.loop = true;
        Ninjaaudio.play().catch(() => {});
        firstInteraction = true;
    }
}

/* Basic jump (CSS animation based) */
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

/* Move ninja to the left */
function moveLeft() {
    handleFirstInteraction();
    if (gameEnded) return;

    let ninjaX = parseInt(getComputedStyle(Ninja).left);
    Ninja.style.left = Math.max(0, ninjaX - 80) + "px";
}

/* Move ninja to the right */
function moveRight() {
    handleFirstInteraction();
    if (gameEnded) return;

    let ninjaX = parseInt(getComputedStyle(Ninja).left);
    Ninja.style.left = Math.min(window.innerWidth - 150, ninjaX + 80) + "px";
}


/* ================= KEYBOARD CONTROLS ================= */
/* Arrow key support */
document.onkeydown = function (e) {
    if (!gameStarted || gameEnded) return;

    if (e.keyCode === 38) jumpNinja();  // Up arrow
    if (e.keyCode === 37) moveLeft();   // Left arrow
    if (e.keyCode === 39) moveRight();  // Right arrow
};


/* ================= GAME LOOP & COLLISION ================= */
/* Main collision detection and scoring loop */
setInterval(() => {
    if (!gameStarted || gameEnded) return;

    let NX = parseInt(getComputedStyle(Ninja).left);
    let NY = parseInt(getComputedStyle(Ninja).top);

    let DX = parseInt(getComputedStyle(Dragon).left);
    let DY = parseInt(getComputedStyle(Dragon).top);

    let offsetX = Math.abs(NX - DX);
    let offsetY = Math.abs(NY - DY);

    /* Collision detected */
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
    /* Successful dodge → increase score */
    else if (offsetX < 50 && cross) {
        score++;
        updatescore(score);
        cross = false;

        setTimeout(() => cross = true, 1000);
    }
}, 10);


/* ================= SCORE & RESTART ================= */
/* Updates score display */
function updatescore(score) {
    myscore.innerHTML = "<b>Your Score: " + score + "</b>";
}

/* Reload game */
reloadBtn.addEventListener("click", () => {
    location.reload();
});


/* ================= ADVANCED JUMP (PHYSICS-STYLE) ================= */
/* Smooth jump using CSS transitions (mobile optimized) */
function jumpNinja() {
    handleFirstInteraction();
    if (gameEnded) return;

    /* Prevent double jump */
    if (Ninja.classList.contains("jumping")) return;

    Ninja.classList.add("jumping");
    jumpAudio.play();

    let isMobile = window.innerWidth <= 768;

    /* Calculate jump height */
    let jumpHeight = isMobile
        ? window.innerHeight * 0.45
        : window.innerHeight * 0.55;

    /* Move ninja up */
    Ninja.style.transition = "bottom 0.3s ease-out";
    Ninja.style.bottom = jumpHeight + "px";

    /* Pause briefly in air on mobile */
    setTimeout(() => {
        let pauseTime = isMobile ? 450 : 0;

        setTimeout(() => {
            /* Bring ninja back down */
            Ninja.style.transition = "bottom 0.4s ease-in";
            Ninja.style.bottom = "0px";

            setTimeout(() => {
                Ninja.classList.remove("jumping");
            }, 400);

        }, pauseTime);

    }, 300);
}
