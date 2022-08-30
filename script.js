const mobileControl = document.querySelector(".mobile-control");
const board = document.querySelector(".board");
const withBoard = board.clientWidth;
const widthContainer = document.querySelector(".container").clientWidth;
const countSquary = widthContainer>770 ? 700 : 484;
if (widthContainer > 770) mobileControl.remove();
for (let k = 0; k<countSquary; k++) {
    const squary = document.createElement('div');
    squary.classList.add('squary');
    board.append(squary);
}

const squaries = Array.from(document.querySelectorAll(".squary"));

const withSquary = squaries[0].clientWidth + 2 * 2;
const countInLine = Math.floor(withBoard / withSquary);
const countLine = countSquary / countInLine;
const startIndexSnake = countSquary / 2;
let rightBoardIndex = [countInLine-1];
let leftBoardIndex = [0]
for (let j = 1; j<countLine; j++) {
    rightBoardIndex.push(rightBoardIndex.at(-1) + countInLine)
    leftBoardIndex.push(leftBoardIndex.at(-1) + countInLine)
}

let topBoardIndex = [];
let bottomBoardIndex = [];
for (let k = 0; k<countInLine; k++) {
    topBoardIndex.push(k)
    bottomBoardIndex.push(countSquary - k - 1);
}

let moves = ['u'];
let partSnake = [];
let active;
const colors = ['color1', 'color2']
const screens = document.querySelectorAll(".screen");
const scoreGame = document.querySelector(".score-game")
let score = 0;
const resultModal = document.querySelector(".result-modal");
const resultScore = document.querySelector(".result-score")
const startBtn = document.querySelector('#start-btn');
const newGame = document.querySelector(".new-game");
const changeMode = document.querySelector(".change-mode")

newGame.addEventListener("click", () => {
    startGame(startIndexSnake);
    resultModal.classList.remove('hide');
})

changeMode.addEventListener("click", () => {
    screens[1].classList.remove('up');
    resultModal.classList.remove('hide');
})

startBtn.addEventListener("click", () => {
    screens[0].classList.add('up');
})

const modeBtns = document.querySelector('.mode-btns');
let mode = 'medium';
modeBtns.addEventListener("click", (event) => {
    if (!event.target.classList.contains('btn')) return;
    mode = event.target.getAttribute('data-mode');
    screens[1].classList.add('up');
    startGame(startIndexSnake);
})

function speedSnake() {
    switch(mode) {
        case 'easy':
            return 220;
        case 'medium':
            return 130;
        case 'hard':
            return 50;
    }
}

function startGame(position) {
    score = 0;
    scoreGame.innerHTML = score;
    let speed = speedSnake();
    squaries[position].classList.add('snake');
    partSnake.push(squaries[position]);
    activeSnake(speed);
    createRandomPoint();
}

document.addEventListener("keydown", event => {
    switch (event.key) {
        case 'ArrowRight':
        case 'd':
            if (moves.at(-1) != 'l' || partSnake.length === 1) moves.push('r')
            break;
        case 'ArrowLeft':
        case 'a':
            if (moves.at(-1) != 'r' || partSnake.length === 1) moves.push('l')
            break;
        case 'ArrowDown':
        case 's':
            if (moves.at(-1) != 'u' || partSnake.length === 1) moves.push('d')
            break;
        case 'ArrowUp':
        case 'w':
            if (moves.at(-1) != 'd' || partSnake.length === 1) moves.push('u')
            break;
    }
})

mobileControl.addEventListener("click", event => {
    switch(event.target.getAttribute('data-direction')) {
        case 'r':
            if (moves.at(-1) != 'l' || partSnake.length === 1) moves.push('r')
            break;
        case 'l':
            if (moves.at(-1) != 'r' || partSnake.length === 1) moves.push('l')
            break;
        case 'd':
            if (moves.at(-1) != 'u' || partSnake.length === 1) moves.push('d')
            break;
        case 'u':
            if (moves.at(-1) != 'd' || partSnake.length === 1) moves.push('u')
            break;
    }
})

function leftSnake() {
    if (moves.at(-1) === 'r') return;

    if (leftBoardIndex.includes(squaries.indexOf(partSnake.at(-1)))) {
        moveSnake(countInLine - 1)
    } else {
        moveSnake(-1)
    }

    if (moves.at(-1)!='l') moves.push('l')
    crashSnake();
    plusPoint();

}

function rightSnake() {
    if (moves.at(-1) === 'l') return;

    if (rightBoardIndex.includes(squaries.indexOf(partSnake.at(-1)))) {
        moveSnake(-countInLine + 1)
    } else {
        moveSnake(1)
    }

    if (moves.at(-1)!='r') moves.push('r')
    crashSnake();
    plusPoint();

}

function downSnake() {
    if (moves.at(-1) === 'u') return;

    if (bottomBoardIndex.includes(squaries.indexOf(partSnake.at(-1)))) {
        moveSnake(-bottomBoardIndex.at(-1))
    } else {
        moveSnake(countInLine)
    }

    if (moves.at(-1)!='d') moves.push('d')
    crashSnake();
    plusPoint();

}

function upSnake() {
    if (moves.at(-1) === 'd') return;

    if (topBoardIndex.includes(squaries.indexOf(partSnake.at(-1)))) {
        moveSnake(bottomBoardIndex.at(-1))
    } else {
        moveSnake(-countInLine)
    }

    if (moves.at(-1)!='u') moves.push('u')
    crashSnake();
    plusPoint();
}

function moveSnake(index) {
    let allIndexSnake = [];
    partSnake.forEach(el => {
        allIndexSnake.push(squaries.indexOf(el))
    })

    squaries[allIndexSnake[0]].classList.remove('snake');
    squaries[allIndexSnake.at(-1) + index].classList.add('snake')

    removeColor(partSnake.shift());
    partSnake.push(squaries[allIndexSnake.at(-1) + index])
    getRandomColor();
}

function crashSnake() {
    partSnake.slice(0, -1).forEach(i => {
        if (partSnake.at(-1) === i) {
            moves = ['u'];
            partSnake.forEach(el => {
                el.classList.remove('snake')
                removeColor(el)
            })
            partSnake = [];
            clearInterval(active)
            document.querySelector(".point").classList.remove("point")
            resultModal.classList.add('hide');
            resultScore.innerHTML = score;
        }
    })
}

function directionSnake() {
    switch (moves.at(-1)) {
        case 'r':
            rightSnake();
            break;
        case 'l':
            leftSnake();
            break;
        case 'u':
            upSnake();
            break;
        case 'd':
            downSnake();
            break;
    }
}

function activeSnake(s) {
    active = setInterval(() => {
        directionSnake();
    }, s)
}

function createRandomPoint() {
    let indexPoint = Math.floor(Math.random() * (countSquary - 1));
    let point = squaries[indexPoint]
    point.classList.add('point')
}

function plusPoint() {
    let point = document.querySelector(".point");
    if (partSnake.at(-1) === point) {
        partSnake.unshift(squaries[squaries.indexOf(partSnake[0]) - 1])
        squaries[squaries.indexOf(partSnake[0]) - 1].classList.add('snake')
        point.classList.remove("point")
        createRandomPoint();
        ++score;
        scoreGame.innerHTML = score;
    }
}

function getRandomColor() {
    partSnake.forEach(el => {
        removeColor(el)
        let index = Math.floor(Math.random() * colors.length);
        let color = colors[index]
        el.classList.add(color)
    })
}

function removeColor(element) {
    colors.forEach(color => {
        element.classList.remove(color)
    })
}











