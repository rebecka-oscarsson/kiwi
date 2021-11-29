//html-element
const kiwiBird = document.querySelector(".kiwiBird");
const gameContainer = document.getElementById("gameContainer");
const switches = document.querySelector(".switches");
const scoreDisplay = document.querySelector("#score");
const livesDisplay = document.querySelector("#lives");
const kiwiSound = document.getElementById("kiwi");
const poopSound = document.getElementById("poop");
const deadSound = document.getElementById("dead");
const enemySound = document.getElementById("enemy");
const winSound = document.getElementById("win");
const gameOverSound = document.getElementById("gameOver");

//variabler
let paused = false;
let croc = false; //avgör om det blir krokodil eller dinosaurie
let lives = 3;
let score = 0;
let jumping = false;

//intervall
let dinoJump; //får dinosaurien att hoppa
let collisionDetection; // kollar kollisioner
let clearItems; //tar bort allt som kommer till vänsterkanten
let createFood; //gör bajs och kiwifrukt
let createEnemies;
let moveFood; //flyttar bajs och kiwifrukt


function startGame() {
  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;
  document.addEventListener("keydown", moveBird);
  createFood = setInterval(createFoodItem, 5000);
  createEnemies = setInterval(createEnemy, 20000);
  clearItems = setInterval(clearItem, 300);
  collisionDetection = setInterval(checkCollision, 50)
}

function stopGame() {
  removeElements();
  document.removeEventListener("keydown", moveBird);
  clearInterval(createFood);
  clearInterval(createEnemies);
  clearInterval(clearItems);
  clearInterval(collisionDetection);
  // clearInterval(moveFood);
  paused = true;
}

function removeElements()
{const foodElements = document.querySelectorAll(".food");
for (let index = 0; index < foodElements.length; index++) {
  gameContainer.removeChild(foodElements[index]); 
}}


startGame();

//hoppa
function jump(element, jumptime) {
  if (element.classList.contains("dino")) {
    setTimeout(function () {
      element.classList.add("dinoJump"); //det här ger dinosaurien annorlunda utseende när den hoppar
    }, 300);
  }
  let counter = 0;
  let bottom = 0;
  let timer = setInterval(() => {
    counter++;
    bottom += 5;
    if (counter == 15) {
      clearInterval(timer);
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
  }, jumptime)
}



//flytta fågeln
function moveBird(evt) {
  let moveDistance = 1;
  let birdPosition = parseInt(kiwiBird.style.left);
  switch (evt.key) {
    case "ArrowLeft":
      if (birdPosition > 0) {
        kiwiBird.classList.add("mirror");
        kiwiBird.style.left = birdPosition - moveDistance + "%";
        break;
      }
      break;
    case "ArrowRight":
      if (birdPosition < 96) {
        kiwiBird.classList.remove("mirror");
        kiwiBird.style.left = birdPosition + moveDistance + "%";
        break;
      }
      break;
    case "j":
    case "J":
    case "ArrowUp":
      let birdBottom = parseInt(kiwiBird.style.bottom); //för att man inte ska kunna hoppa när man redan är i luften
      if (birdBottom === 10) {
        jump(kiwiBird, 70);
        console.log(birdBottom);
      }
      break;
  }
}

//slumpa en siffra
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//skapa fiende
function createEnemy() {
  if (!paused) {
    let foodPosition = 100;
    let food = document.createElement("span");
    food.classList.add("food");
    food.style.left = foodPosition + moveDistance + "%";
    enemySound.play();
    food.style.bottom = "10vh";
    if (croc) {
      food.classList.add("croc");
      croc = false;
    } else {
      food.classList.add("dino");
      dinoJump = setInterval(function () {
        console.log("hopp");
        jump(food, 100);
      }, 5000);
      croc = true;
    }
    // behöver jag clearinterval?
    gameContainer.appendChild(food);
    //flyttar maten, bryt ut, hämta array
    //är det här dumt för att varje mat har sitt eget intervall?
    // försvinner det när elementet försvinner?
    setInterval(() => {
      if (!paused) {
        moveDistance = 1;
        foodPosition = parseInt(food.style.left);
        food.style.left = foodPosition - moveDistance + "%";
      }
    }, 100);
  }
}

function createFoodItem() {
  if (!paused) {
    // let moveDistance = 1;
    let randomNumber = Math.random();
    let foodPosition = 100;
    //de skapas 100% till höger på skärmen
    let food = document.createElement("span");
    food.classList.add("food");
    food.style.left = foodPosition + "%";
    food.style.bottom = randomIntFromInterval(30, 80) + "%";
    if (randomNumber > 0.5) {
      food.textContent = "🥝";
    }
    else {
      food.textContent = "💩";
      food.classList.add("zigzag");
    }
    gameContainer.appendChild(food);
    //flyttar maten, bryt ut, hämta array
    //är det här dumt för att varje mat har sitt eget intervall?
    // försvinner det när elementet försvinner?
    moveFood = setInterval(() => {
      if (!paused) {
        console.log("flytt")
        moveDistance = 0.1;
        foodPosition = parseInt(food.style.left);
        food.style.left = foodPosition - moveDistance + "%";
      }
    }, 300);
  }
}

function clearItem() {
  let oldFood = document.querySelectorAll(".food");
  for (let index = 0; index < oldFood.length; index++) {
    const food = oldFood[index];
    let position = window.getComputedStyle(food).getPropertyValue("left");
    if (parseInt(position) <= 0) {
      if (food.classList.contains("dino") || food.classList.contains("croc")) {
        let foodWidth = parseInt(window.getComputedStyle(food).getPropertyValue("width"));
        if (parseInt(position) <= 0 - foodWidth) {
          clearInterval(dinoJump);
          gameContainer.removeChild(food);
        }
      } else {
        gameContainer.removeChild(food)
      };
    }
  }
}

function checkCollision() {
  if (!paused) {
    // let birdWidth = parseInt(window.getComputedStyle(kiwiBird).getPropertyValue("width"));
    // let birdHeight = parseInt(window.getComputedStyle(kiwiBird).getPropertyValue("height"));
    let oldFood = document.querySelectorAll("span.food");
    if (oldFood.length > 0) {
      //det blir fel om funktionen körs innan det finns någon mat
      for (let index = 0; index < oldFood.length; index++) {
        let foodPositionLeft = parseInt(
          window.getComputedStyle(oldFood[index]).getPropertyValue("left")
        );
        let foodPositionBottom = parseInt(
          window.getComputedStyle(oldFood[index]).getPropertyValue("bottom")
        );
        let birdPositionLeft = parseInt(
          window.getComputedStyle(kiwiBird).getPropertyValue("left")
        );
        let birdPositionBottom = parseInt(
          window.getComputedStyle(kiwiBird).getPropertyValue("bottom")
        );
        // console.log("mat: ", foodPositionLeft, foodPositionBottom, "fågel: ", birdPositionLeft, birdPositionBottom)
        if (
          foodPositionLeft > birdPositionLeft - 50 &&
          foodPositionLeft < birdPositionLeft + 50 &&
          foodPositionBottom > birdPositionBottom - 50 &&
          foodPositionBottom < birdPositionBottom + 50
        ) {
          handleCollision(oldFood[index]);
        }
        //  && foodPositionBottom == birdPositionBottom
      }
    }
  }
}

function handleCollision(collidingObject) {
  if (collidingObject.classList.contains("zigzag")) {
    poopSound.play();
    kiwiBird.style.color="sienna";
    score -= 1;
    gameContainer.removeChild(collidingObject);
    scoreDisplay.textContent = score;
  } else if (collidingObject.classList.contains("dino") || collidingObject.classList.contains("croc")) {
    lives -= 1;
    livesDisplay.textContent = lives;
    kiwiBird.classList.add("dead");
    if (lives === 0) {
      gameOverSound.play();
      confirm("Game Over 🙁 Play again?");
      stopGame();
    } else {
      deadSound.play();
      clearInterval(collisionDetection);
      document.removeEventListener("keydown", moveBird);
      setTimeout(function () {
        kiwiBird.classList.remove("dead");
        collisionDetection = setInterval(checkCollision, 50)
        document.addEventListener("keydown", moveBird);
      }, 2500);
    }
  } else {
    kiwiBird.style.color="teal";
    kiwiSound.play();
    score += 1;
    gameContainer.removeChild(collidingObject);
    scoreDisplay.textContent = score;
    if (score >= 3) {
      winSound.play();
      alert("du vann!");
      stopGame();
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
        document.querySelector(".pause").textContent = "pause";
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
          document.querySelector(".sound").style.textDecoration = "none";
          break;
        } else {
          audio.muted = true;
          document.querySelector(".sound").style.textDecoration = "line-through";
          break;
        }
  }
});