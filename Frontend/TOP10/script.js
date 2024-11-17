const boardState = {
    name: "",
    group: [],
    found: [],
    gameEnd: false,
    animation: false,
};

async function fetchGroupTop10(){
    try{
        const response = await fetch(`http://localhost:3000/api/top10`);
        const dataGroup = await response.json();
        const randomGroup = Math.floor(Math.random() * dataGroup.length);

        const selectedGroup = dataGroup[randomGroup];
        boardState.name = selectedGroup.name;
        boardState.group = selectedGroup.top10;
    }
    catch(error){
        alert(error.message);
    }
}

function startTop10() {
    const board = document.getElementById('board');
    drawTriangle(board);
    drawOthers(board);
}

document.addEventListener('DOMContentLoaded', async(event) => {
    await fetchGroupTop10();
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
    title.innerHTML = boardState.name;
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

function getLastName(fullName){
    let playerName = fullName.split(" ");
    let lastName = "";
    for(let i=1; i<playerName.length; i++){
        lastName += playerName[i];
        if(playerName.length - i > 1)
            lastName += " ";
    }
    return lastName;
}

function checkGuess(){
    if(boardState.gameEnd)
        return;

    const guess = boardState.inputLine.value.toLowerCase();
    let number = -1;
    let jersey = "";
    for(let i=0; i<10; i++){    
        if(guess == boardState.group[i].Name.toLowerCase() || guess == getLastName(boardState.group[i].Name).toLowerCase()){
            jersey = boardState.group[i].Jersey;
            if(!boardState.found.includes(i+1)){
                number = i+1;
                boardState.found.push(number);
            }
            else{
                boardState.mistake.innerHTML = "Already guessed " + boardState.group[i].Name + "!";
                return;
            }
        }
    }

    if(number == -1){
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
                box.style.animationDelay = `${(-i + 10 - numberAnimation) * 0.2}s`;
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
        box.style.animationDelay = `${(-number + 10 - numberAnimation) * 0.2}s`;

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
    
    for(let i=0; i<10; i++){
        if(!boardState.found.includes(i+1)){
            let box = document.getElementById(`box${i+1}`);
            box.classList.add('animateFound');
            box.style.animationDelay = "0s";
            box.addEventListener("animationend", () =>{
                box.classList.remove('animateFound');
                box.style.color = "transparent";
                box.style.backgroundImage = "url('" + boardState.group[i].Jersey + "')";
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

