let bluebird = document.querySelector(".bluebird");


function jump(element) {
    let counter = 0;
    let bottom = 0;
    let timer = setInterval(() => {
        counter++;
        bottom += 5;
        if (counter == 10) {
            clearInterval(timer)
            let timerDown = setInterval(() => {
                if (bottom == 0) {
                    clearInterval(timerDown)
                } else {
                    bottom -= 10;
                    element.style.bottom = bottom + "%";
                }
            }, 50);
        }
        element.style.bottom = bottom + "%";
    }, 50);
}

// bluebird.style.left = "0%";
//varför?

document.addEventListener("keydown", function (evt) {
    let moveDistance = 1;
    let birdPosition = parseInt(bluebird.style.left);


    switch (evt.key) {
        case "ArrowLeft":
            bluebird.classList.remove("jump2");
            if (birdPosition > 0) {
                bluebird.classList.add("mirror");
                bluebird.style.left = birdPosition - moveDistance + "%";
                break;
            }
            break;
        case "ArrowRight":
            bluebird.classList.add("jump2");
            if (birdPosition < 96) {
                bluebird.classList.remove("mirror");
                bluebird.style.left = birdPosition + moveDistance + "%";
                break;
            }
            break;
        case "j":
            jump(bluebird);
            break;
    }
});

const gameContainer = document.getElementById("gameContainer");




// function createFood() {
//     let oldFood = document.querySelectorAll(".moveLeft");
//     if(oldFood[0]) {alert (oldFood[0].style.left)}
//     // if(oldFood) {oldFood.style.borderColor="red"};
//     // bluebird.style.borderColor="red";gameContainer.style.backgroundColor = "pink";
//     // if (oldFood != undefined && parseInt(oldFood.style.left)==0) 

//     let randomNumber = Math.random();
//     let food = document.createElement("span");
//     food.style.left = "100%";
//     food.style.bottom = "70%";
//     food.classList.add("moveLeft");
//     if (randomNumber > 0.5) {
//         food.classList.add("fas");
//         food.classList.add("fa-candy-cane");
//     }
//     else {
//         food.classList.add("fas");
//         food.classList.add("fa-poo");
//     };
//     gameContainer.appendChild(food);
// }

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createFood2() {

    let moveDistance = 1;
    let randomNumber = Math.random();
    let foodPosition = 100;
    let food = document.createElement("span");
    food.style.left = foodPosition + moveDistance + "%";
    food.style.bottom = randomIntFromInterval(20, 80) + "%";
    food.classList.add("fas");
    if (randomNumber > 0.3) {
        food.classList.add("fa-candy-cane");
    } else {
        food.classList.add("fa-poo");
    };
    gameContainer.appendChild(food);
    //flyttar maten, bryt ut, hämta array
    let moveFood = setInterval(() => {
        moveDistance = 0.1;
        foodPosition = parseInt(food.style.left);
        food.style.left = foodPosition - moveDistance + "%";
        let oldFood = document.querySelectorAll("span");
        if (oldFood[0]) {
            let position = window.getComputedStyle(oldFood[0]).getPropertyValue("left");
            if (parseInt(position) < 0) {
                console.log(position);
                gameContainer.removeChild(oldFood[0])
                // clearInterval(moveFood);
            }
        }
    }, 300)
}

function collision() {
    let detection = setInterval(() => {
            let birdWidth = parseInt(window.getComputedStyle(bluebird).getPropertyValue("width"));
            let birdHeight = parseInt(window.getComputedStyle(bluebird).getPropertyValue("height"));
            let oldFood = document.querySelectorAll("span");
            if (oldFood.length>0) { //det blir fel om funktionen körs innan det finns någon mat
                for (let index = 0; index < oldFood.length; index++) {
                    let foodPositionLeft = parseInt(window.getComputedStyle(oldFood[index]).getPropertyValue("left"));
                    let foodPositionBottom = parseInt(window.getComputedStyle(oldFood[index]).getPropertyValue("bottom"));
                    let birdPositionLeft = parseInt(window.getComputedStyle(bluebird).getPropertyValue("left"));
                    let birdPositionBottom = parseInt(window.getComputedStyle(bluebird).getPropertyValue("bottom"));
                    console.log("mat: ", foodPositionLeft, foodPositionBottom, "fågel: ", birdPositionLeft, birdPositionBottom)
                    if (foodPositionLeft > birdPositionLeft - 100 && foodPositionLeft < birdPositionLeft +100  && foodPositionBottom > birdPositionBottom - 100 && foodPositionBottom < birdPositionBottom +100)
                    {var sound = document.getElementById("myAudio");
                    sound.play();
                    gameContainer.removeChild(oldFood[index])};
                    //  && foodPositionBottom == birdPositionBottom 
                }
            }
        }, 50)
}


//hämta position för all mat
//loopa igenom och jämför med position för fågeln
//om samma kolla klassnamn
//om polkagris +1
//om bajs clearinterval






function makeFlyingFood() {
    setInterval(
        createFood2, 2000)
}

makeFlyingFood()
collision()