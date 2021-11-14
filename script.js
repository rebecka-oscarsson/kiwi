//html-element
const bluebird = document.querySelector(".bluebird");
const gameContainer = document.getElementById("gameContainer");
const switches = document.querySelector(".switches");
const scoreDisplay = document.querySelector("#score");
const livesDisplay = document.querySelector("#lives");

//variabler
let paused = false;
let lives = 3;
let score = 0;

//intervall
let dinoJump;
let detection;

//körs vid sidladdning

function startGame() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    document.addEventListener("keydown", (evt) => moveBird(evt));
}

scoreDisplay.textContent = score;
livesDisplay.textContent = lives;
document.addEventListener("keydown", (evt) => moveBird(evt));
alert("Play using arrows and J on keyboard")


//hoppa
function jump(element, jumptime) {
    if (element.classList.contains("dino")) {
        setTimeout(function () {
            element.classList.add("dinoJump");
        }, 300);
    };
    let counter = 0;
    let bottom = 0;
    let timer = setInterval(() => {
        counter++;
        bottom += 5;
        if (counter == 15) {
            clearInterval(timer)
            let timerDown = setInterval(() => {
                if (bottom == 10) {
                    clearInterval(timerDown);
                    element.classList.remove("dinoJump");
                } else {
                    bottom -= 5;
                    element.style.bottom = bottom + "%";
                }
            }, jumptime);
        }
        element.style.bottom = bottom + "%";
    }, jumptime);
}


//flytta fågeln
function moveBird(evt) {
    let moveDistance = 1;
    let birdPosition = parseInt(bluebird.style.left);

    switch (evt.key) {
        case "ArrowLeft":
            // bluebird.classList.remove("jump");
            if (birdPosition > 0) {
                bluebird.classList.add("mirror");
                bluebird.style.left = birdPosition - moveDistance + "%";
                break;
            }
            break;
        case "ArrowRight":
            // bluebird.classList.add("jump");
            if (birdPosition < 96) {
                bluebird.classList.remove("mirror");
                bluebird.style.left = birdPosition + moveDistance + "%";
                break;
            }
            break;
        case "j":
        case "J":
        case "ArrowUp":
            jump(bluebird, 70);
            break;
    }
};

//slumpa en siffra
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//skapa fiende
function createDino() {
    if (!paused) {
        let foodPosition = 100;
        let food = document.createElement("span");
        food.classList.add("food");
        food.style.left = foodPosition + moveDistance + "%";
        var sound = document.getElementById("myAudio");
        var loops = 1;
        var count = 0;
        sound.play();
        // sound.onended = function () {
        //     if (count < loops) {
        //         count++;
        //         this.play();
        //     }
        // }
        food.style.bottom = "10vh";
        food.classList.add("dino");
        dinoJump = setInterval(function () {
            console.log("hopp")
            jump(food, 100)
        }, 5000);
        // behöver jag clearinterval?
        gameContainer.appendChild(food);
        //flyttar maten, bryt ut, hämta array
        //är det här dumt för att varje mat har sitt eget intervall?
        // försvinner det när elementet försvinner?
        let moveFood = setInterval(() => {
            if (!paused) {
                moveDistance = 1;
                foodPosition = parseInt(food.style.left);
                food.style.left = foodPosition - moveDistance + "%";
            }
        }, 100)
    }
}

function createFood() {
    if (!paused) {
        // let moveDistance = 1;
        let randomNumber = Math.random();
        let foodPosition = 100;
        //de skapas 100% till höger på skärmen
        let food = document.createElement("span");
        food.classList.add("food");
        food.style.left = foodPosition + "%";
        food.style.bottom = randomIntFromInterval(30, 80) + "%";
        // food.classList.add("fas");
        if (randomNumber > 0.5) {
            food.textContent = "🥝"
            // food.classList.add("fa-candy-cane");
        }
        //else if (randomNumber < 0.2) {


        //     var sound = document.getElementById("myAudio");
        //     var loops = 1;
        //     var count = 0;
        //     sound.play();
        //     sound.onended = function () {
        //         if (count < loops) {
        //             count++;
        //             this.play();
        //         }
        //     }


        //     food.style.bottom = "10vh";
        //     food.classList.add("dino");

        //     let dinoJump = setInterval(function () {
        //         jump(food)
        //     }, 8000);
        //     // behöver jag clearinterval?
        // }
        else {
            // food.classList.add("fa-poo");
            food.textContent = "💩"
            food.classList.add("zigzag");
        };
        gameContainer.appendChild(food);
        //flyttar maten, bryt ut, hämta array
        //är det här dumt för att varje mat har sitt eget intervall?
        // försvinner det när elementet försvinner?
        let moveFood = setInterval(() => {
            if (!paused) {
                moveDistance = 0.1;
                foodPosition = parseInt(food.style.left);
                food.style.left = foodPosition - moveDistance + "%";
            }
        }, 300)
    }
}



function removeFood() {
    setInterval(() => {
        let oldFood = document.querySelectorAll(".food");
        for (let index = 0; index < oldFood.length; index++) {
            const food = oldFood[index];
            let position = window.getComputedStyle(food).getPropertyValue("left");
            if (parseInt(position) <= 0) {
                console.log(position);
                if (food.classList.contains("dino")) {
                    console.log("dino ute");
                    clearInterval(dinoJump);
                    setTimeout(function() {
                    gameContainer.removeChild(food);
                }, 2000);
                //node is not a child?
                }
                else {gameContainer.removeChild(food);} 
            }
        }

        // if (oldFood[0]) {
        //     let position = window.getComputedStyle(oldFood[0]).getPropertyValue("left");
        //     if (parseInt(position) <= 0) {
        //         console.log(position);
        //         if(parseInt(position) <= 0 && oldFood[0].classList.contains("dino"))
        //         {console.log("dino ute"); clearInterval(dinoJump)}
        //         gameContainer.removeChild(oldFood[0]);
        //     }
        // }
    }, 300)
}



function collision() {
    if (!paused) {
        detection = setInterval(() => {
            // let birdWidth = parseInt(window.getComputedStyle(bluebird).getPropertyValue("width"));
            // let birdHeight = parseInt(window.getComputedStyle(bluebird).getPropertyValue("height"));
            let oldFood = document.querySelectorAll("span.food");
            if (oldFood.length > 0) { //det blir fel om funktionen körs innan det finns någon mat
                for (let index = 0; index < oldFood.length; index++) {
                    let foodPositionLeft = parseInt(window.getComputedStyle(oldFood[index]).getPropertyValue("left"));
                    let foodPositionBottom = parseInt(window.getComputedStyle(oldFood[index]).getPropertyValue("bottom"));
                    let birdPositionLeft = parseInt(window.getComputedStyle(bluebird).getPropertyValue("left"));
                    let birdPositionBottom = parseInt(window.getComputedStyle(bluebird).getPropertyValue("bottom"));
                    // console.log("mat: ", foodPositionLeft, foodPositionBottom, "fågel: ", birdPositionLeft, birdPositionBottom)
                    if (foodPositionLeft > birdPositionLeft - 50 && foodPositionLeft < birdPositionLeft + 50 && foodPositionBottom > birdPositionBottom - 50 && foodPositionBottom < birdPositionBottom + 50) {
                        handleCollision(oldFood[index])
                    };
                    //  && foodPositionBottom == birdPositionBottom 
                }
            }
        }, 50)
    }
}


function handleCollision(collidingObject) {
    if (collidingObject.classList.contains("zigzag")) {
        score -= 1;
        gameContainer.removeChild(collidingObject);
        scoreDisplay.textContent = score;
    } else if (collidingObject.classList.contains("dino")) {
        console.log("dino")
        lives -= 1;
        livesDisplay.textContent = lives;
        bluebird.classList.add("dead");
        if (lives === 0) {
            livesDisplay.textContent = lives;
            alert("game over")
        } else {
            clearInterval(detection);
            document.removeEventListener("keydown", (evt) => moveBird(evt))
            setTimeout(function () {
                bluebird.classList.remove("dead");
                collision();
                // document.addEventListener("keydown", (evt) => moveBird(evt));
            }, 5000);
        }
    } else {
        console.log("kiwi")
        score += 1;
        gameContainer.removeChild(collidingObject);
        scoreDisplay.textContent = score;
        if (score >= 12) {
            alert("du vann!")
            clearInterval(makeDino);
            clearInterval(makeFood);
        }
    }
}

//hämta position för all mat
//loopa igenom och jämför med position för fågeln
//om samma kolla klassnamn
//om polkagris +1
//om dino clearinterval


switches.addEventListener("change", (e) => {
    switch (e.target.id) {
        case "pauseButton":
            if (!e.target.checked) {
                paused = true;
                document.querySelector(".pause").textContent = "pause"
                break;
            } else {
                paused = false;
                document.querySelector(".pause").textContent = "play";
                break;
            }
            case "musicButton":
                const audio = document.getElementById("myAudio");
                if (e.target.checked) {
                    audio.muted = false;
                    document.querySelector(".sound").textContent = "on";
                    break;
                } else {
                    audio.muted = true;
                    document.querySelector(".sound").textContent = "off";
                    break;
                }

    }
})


let makeFood;
let makeDino

function makeFlyingFood() {
    makeFood = setInterval(
        createFood, 5000)
    makeDino = setInterval(
        createDino, 20000)
}


makeFlyingFood()
collision()
removeFood()