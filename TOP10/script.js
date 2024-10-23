import {players, getJersey, getName, getLastName, getPosition, getTeam, getAge, getNumber} from "../players.js";

const grupJucatori = [
    ["Baltimore players with lowest numbers", players.baltimore[0], players.baltimore[2], players.baltimore[3], players.baltimore[4], players.baltimore[5], players.baltimore[7], players.baltimore[8], players.baltimore[9], players.baltimore[10], players.baltimore[11]],
]

const boardState = {
    grup: grupJucatori[Math.floor(Math.random() * grupJucatori.length)],
    found: [],
    gameEnd: false,
    animation: false,
};

function startTop10() {
    const board = document.getElementById('board');
    drawTriangle(board);
    drawOthers(board);
}

document.addEventListener('DOMContentLoaded', (event) => {
    startTop10();
})
  

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(boardState.gameEnd)
        return;
    if(key == "Enter"){
        checkGuess();
    }
})

function drawTriangle(board){
    const triangle = document.createElement('div');
    triangle.className = 'triangle';

    let row = document.createElement('div');
    row.className = 'row';
    for(let i=0; i<10; i++){
        /*
        1 -> 0
        23 -> 1
        456 -> 2
        7890 -> 3
        */
        drawBox(row, i);
        if(i == 0){
            triangle.appendChild(row);
            row = document.createElement('div');
            row.className = 'row';
        }
        else if(i == 2){
            triangle.appendChild(row);
            row = document.createElement('div');
            row.className = 'row';
        }
        else if(i == 5){
            triangle.appendChild(row);
            row = document.createElement('div');
            row.className = 'row';
        }
        else if(i == 9){
            triangle.appendChild(row);
        }
    }

    board.appendChild(triangle);
}

function drawBox(row, number){
    let box = document.createElement('div');
    box.className = 'box';
    box.innerHTML = number + 1;
    box.id = `box${number+1}`;

    row.appendChild(box);
}

function drawOthers(board){
    const title = document.createElement('div');
    title.className = 'title';
    title.innerHTML = boardState.grup[0];
    board.appendChild(title);

    const divInput = document.createElement('div');

    const inputLine = document.createElement('input');
    inputLine.type = 'text';
    inputLine.className = 'inputLine';
    boardState.inputLine = inputLine;
    divInput.appendChild(inputLine);

    const buttonGuess = document.createElement('button');
    buttonGuess.className = 'buttonGuess';
    buttonGuess.innerHTML = "Guess";
    buttonGuess.addEventListener("click", checkGuess);
    divInput.appendChild(buttonGuess);

    const buttonGiveUp = document.createElement('button');
    buttonGiveUp.className = 'buttonGiveUp';
    buttonGiveUp.innerHTML = "Give Up";
    buttonGiveUp.addEventListener("click", giveUp);
    divInput.appendChild(buttonGiveUp);

    board.appendChild(divInput);

    const divMistake = document.createElement('div');
    divMistake.style.marginTop = "16px";
    boardState.mistake = divMistake;
    board.appendChild(divMistake);
}

function checkGuess(){
    if(boardState.gameEnd)
        return;

    const guess = boardState.inputLine.value.toLowerCase();
    let number = 0;
    let jersey = "";
    for(let i=1; i<11; i++){    
        if(guess == getName(boardState.grup[i]).toLowerCase() || guess == getLastName(boardState.grup[i]).toLowerCase()){
            jersey = getJersey(boardState.grup[i]);
            if(!boardState.found.includes(i)){
                number = i;
                boardState.found.push(number);
            }
            else{
                boardState.mistake.innerHTML = "Already guessed " + getName(boardState.grup[i]) + "!";
                return;
            }
        }
    }

    if(number == 0){
        boardState.mistake.innerHTML = guess + " it's not right!";
    }
    else{
        boardState.inputLine.value = "";
        boardState.mistake.innerHTML = "";

        let numberAnimation = 0;
        for(let i=10; i>number; i--){
            if(!boardState.found.includes(i)){
                let box = document.getElementById(`box${i}`);
                box.classList.add('animateNotFound');
                box.style.animationDelay = `${(-i + 10 - numberAnimation) * 0.5}s`;
                box.addEventListener("animationend", () =>{
                    box.classList.remove('animateNotFound');
                })
            }
            else{
                numberAnimation++;
            }
        } 
        let box = document.getElementById(`box${number}`);
        box.classList.add('animateFound');
        box.style.animationDelay = `${(-number + 10 - numberAnimation) * 0.5}s`;

        box.addEventListener("animationend", () =>{
            box.classList.remove('animateFound');
            box.style.backgroundColor = "green";
            box.style.color = "transparent";
            box.style.backgroundImage = "url('" + jersey + "')";
        })

        checkWin();
    }
}

function giveUp(){
    if(boardState.gameEnd)
        return;
    
    for(let i=1; i<11; i++){
        if(!boardState.found.includes(i)){
            let box = document.getElementById(`box${i}`);
            box.classList.add('animateFound');
            box.style.animationDelay = "0s";
            box.addEventListener("animationend", () =>{
                box.classList.remove('animateFound');
                box.style.color = "transparent";
                box.style.backgroundImage = "url('" + getJersey(boardState.grup[i]) + "')";
                box.style.backgroundColor = "red";
            })
        }
    }
    boardState.gameEnd = true;
    boardState.inputLine.disabled = true;
}

function checkWin(){
    if(boardState.found.length == 10){
        let popup = document.getElementById('popup');
        let container = document.getElementById("container");
        let close = document.getElementById("closePopup");
        let mesaj = document.getElementById("resultMessage");
        let mesajWin = `Felicitari!`;

        popup.classList.add("show");
        container.classList.add("blurred");
        mesaj.innerHTML = mesajWin;
        boardState.gameEnd = true;
        boardState.inputLine.disabled = true;

        close.addEventListener("click", ()=>{
            popup.classList.remove("show");
            container.classList.remove("blurred");
        })
    }
}

