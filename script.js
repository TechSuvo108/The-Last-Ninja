let Ninja = document.querySelector(".ninja");
let Dragon = document.querySelector(".dragon");
let gameover = document.querySelector(".gameover");
let myscore = document.querySelector(".score");

let Ninjaaudio = new Audio("NinjaBackgroundmusic.mp3");
let jump = new Audio("Jump.mp3");
let End = new Audio("GameOver.mp3");

let score = 0;
let cross = true;
let gameEnded = false; //Track if the game is over
let firstInteraction= false;

Ninja.classList.remove("animateninja");

document.onkeydown = function (e) {
    //Start backgroundmusic on first interaction
    if(!firstInteraction){
        Ninjaaudio.loop = true;
        Ninjaaudio.play();
        firstInteraction = true;
    }

    if (gameEnded) return; // This line means if gameEnded == false then only you can access this part of code
    // If the game has ended (gameEnded is true), stop execution immediately. 
    // This prevents further actions like moving the ninja or updating the score.


    if (e.keyCode == 38) {
        Ninja.classList.add("animateninja");
        setTimeout(() => {
            Ninja.classList.remove("animateninja");
        }, 700);
    }
    if (e.keyCode == 39) {
        let ninjaX = parseInt(window.getComputedStyle(Ninja, null).getPropertyValue('left'));
        Ninja.style.left = ninjaX + 115 + "px";
    }
    if (e.keyCode == 37) {
        let ninjaX = parseInt(window.getComputedStyle(Ninja, null).getPropertyValue('left'));
        Ninja.style.left = ninjaX - 115 + "px";
    }
};

setInterval(() => {
    if (gameEnded) return;

    let NX = parseInt(window.getComputedStyle(Ninja, null).getPropertyValue('left'));
    let NY = parseInt(window.getComputedStyle(Ninja, null).getPropertyValue('top'));

    let DX = parseInt(window.getComputedStyle(Dragon, null).getPropertyValue('left'));
    let DY = parseInt(window.getComputedStyle(Dragon, null).getPropertyValue('top'));

    let offsetX = Math.abs(NX - DX);
    let offsetY = Math.abs(NY - DY);

    if (offsetX < 73 && offsetY < 52) {
        gameover.innerHTML = "GAME OVER - RELOAD TO PLAY AGAIN"
        gameEnded = true;

        Dragon.style.animation = "none"; //Pause the dragon at the accident position
        Dragon.style.left = DX + "px" // Keeps it at the crash position

        document.onkeydown = null; // Disable all key actions after game over

        Ninjaaudio.pause();    // Stop background music
        End.play();     // Play game over sound
    }
    else if (offsetX < 50 && cross) {
        score += 1;
        updatescore(score);
        cross = false;
        jump.play();
        setTimeout(() => {
            cross = true;
            jump.pause();
        }, 1000);
    }
}, 10);


function updatescore(score) {
    if (!gameEnded) {
        myscore.innerText = "Your Score: " + score;
    }
}




