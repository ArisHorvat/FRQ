const boardState = {
    group: [],
    type: ["easy", "medium", "hard", "extreme"],
    guess: [],
    lastAnswer: "",
    boxesSelected: 0,
    gameEnd: false,
    animation: false,
    namesShown: false,
    nrMistakes: 0,
};

async function fetchGroupConnections(){
    try{
        const response = await fetch(`http://localhost:3000/api/connections`)
        const dataGroup = await response.json();
        const randomGroup = Math.floor(Math.random() * dataGroup.length);
        
        const selectedGroup = dataGroup[randomGroup];
        const connectionNames = []

        for(const connection of selectedGroup.connections){
            connectionNames.push(connection.name);
        }
        boardState.group.push(connectionNames);

        for(const connection of selectedGroup.connections){
            const currentConnection = []
            for(const element of connection.elements){
                const responsePlayer = await fetch(`http://localhost:3000/api/filter-player/${element}`);
                const dataPlayer = await responsePlayer.json();
                currentConnection.push(dataPlayer[0])
            }
            boardState.group.push(currentConnection);
        }
    }
    catch(error){
        alert(error.message);
    }
}

function startConnections() {    
    boardState.board = document.getElementById('board');
    for(let i=1; i<5; i++){
        boardState.group[i].sort((a, b)=>{
            if(a.Name < b.Name)
                return -1;
            if(a.Name > b.Name)
                return 1;
            return 0;
        });
    }
    drawGrid(boardState.board);
    drawOthers(boardState.board);
}

document.addEventListener('DOMContentLoaded', async (event) => {
    await fetchGroupConnections();
    startConnections();
})
  

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(boardState.gameEnd)
        return;
})

function drawGrid(board) {
    if(boardState.group.length == 5 && boardState.nrMistakes == 0){
        const grid = document.createElement('div');
        grid.className = 'grid';
    
        if(!boardState.gameEnd)
            randomBoxes(grid);

        board.appendChild(grid);
    }
    else if(boardState.lastAnswer != ""){
        const grid = document.createElement('div');
        grid.className = 'grid';
        
        if(!boardState.gameEnd)
            randomBoxes(grid);
        
        board.replaceChild(grid, board.children[3 - boardState.group[0].length]);
        
        drawBoxRight(board, boardState.lastAnswer);
    }
}

function randomBoxes(grid){
    const allBoxes = [];
    for (let i = 1; i < boardState.group.length; i++) {
        const currentGrup = boardState.group[i]; 
        for (let j = 0; j < 4; j++) {
            allBoxes.push(currentGrup[j]);
        }
    }

    for(let i=0; i<100; i++){
        let i = Math.floor(Math.random() * allBoxes.length);
        let j = Math.floor(Math.random() * allBoxes.length);
        let aux = allBoxes[i];
        allBoxes[i] = allBoxes[j];
        allBoxes[j] = aux;
    }

    let j=0;
    for(let i=0; i<allBoxes.length; i++){
        drawBox(grid, Math.floor(i/4), j, allBoxes[i]);
        j++;
        if(j==4)
            j=0;
    }

    return grid;
}
  
function drawBox(grid, row, col, player) {
      const box = document.createElement('button');
      box.className = 'box';
      box.textContent = player.Name;

      box.style.backgroundImage = "url('" + player.Jersey + "')";

      box.id = `box${row}${col}`;
      
      box.addEventListener("click", () =>{
        if(!boardState.gameEnd){
            const computedStyle = window.getComputedStyle(box); 
            if(computedStyle.backgroundColor == "rgb(128, 128, 128)"){
                if(boardState.boxesSelected == 0)
                    return;
                box.classList.remove("selected");
                
                boardState.boxesSelected--;
                const index = boardState.guess.indexOf(player.Name);
                if(index > -1){
                    boardState.guess.splice(index, 1);
                }
                
            }
            else if(computedStyle.backgroundColor == "rgb(255, 255, 255)"){
                if(boardState.boxesSelected == 4)
                    return;
                box.classList.add("selected");

                boardState.boxesSelected++;
                boardState.guess.push(player.Name);
            }
        }
      })
    
      grid.appendChild(box);
      return box;
}

function drawBoxRight(board, answer){
    const box = document.createElement('div');
    box.className = 'box';
    box.classList.add('right');
    box.innerHTML = answer;
    box.style.animationName = "rightGuess";
    box.style.animationDuration = "0.7s";
    box.style.animationTimingFunction = "ease";

    board.children[3 - boardState.group[0].length].style.animationName = "";
    board.insertBefore(box, board.children[3 - boardState.group[0].length]);
}

function drawOthers(board){
    const mistakeCounter = document.createElement('div');
    mistakeCounter.className = "mistakeCounter";

    const mistakeText = document.createElement('div');
    mistakeText.className = "mistakeText";
    mistakeText.innerHTML = "Number of mistakes: ";
    mistakeCounter.appendChild(mistakeText);

    for(let i=0; i<5; i++){
        const mistakeBox = document.createElement('div');
        mistakeBox.className = 'mistakeBox';
        mistakeBox.id = `mistake${i+1}`;
        mistakeCounter.appendChild(mistakeBox);
    }

    board.appendChild(mistakeCounter);

    const divButtons = document.createElement('div');
    divButtons.className = "divButtons";

    const guessButton = document.createElement('button');
    guessButton.className = "buttonGuess";
    guessButton.innerHTML = "Guess";
    guessButton.addEventListener("click", () =>{
        checkGuess();
    });
    divButtons.appendChild(guessButton);

    const giveupButton = document.createElement('button');
    giveupButton.className = "buttonGiveUp";
    giveupButton.innerHTML = "Give Up";
    divButtons.appendChild(giveupButton);

    const show = document.createElement('button');
    show.className = "buttonShow";
    show.innerHTML = "Show Names";
    show.addEventListener("click", () =>{
        showNames();
    });
    divButtons.appendChild(show);

    board.appendChild(divButtons);
}

function checkGuess(){
    if(boardState.boxesSelected == 4 && boardState.gameEnd == false){
        const guess = boardState.guess;
        let solution = false;
        guess.sort();

        for(let i=1; i<boardState.group.length; i++){
            const currentGrup = boardState.group[i];
            let found = true;
            for(let j=0; j<4; j++){
                if(guess[j] != currentGrup[j].Name)
                    found = false;
            }
            if(found){
                solution = true;
                boardState.lastAnswer = boardState.group[0][i-1];

                boardState.group[0].splice(i-1, 1);
                boardState.group.splice(i, 1);
                boardState.boxesSelected = 0;
                boardState.guess = [];
                break;   
            }
        }

        if(!solution){
            boardState.lastAnswer = "";
            boardState.nrMistakes++;
            const mistakeBox = document.getElementById(`mistake${boardState.nrMistakes}`);
            mistakeBox.style.backgroundColor = "red";
        }

        checkWin();
    }
}

function checkWin(){
    if(boardState.nrMistakes >= 5){
        alert("Game Over!");
        boardState.gameEnd = true;
    }

    if(boardState.group[0].length == 0){
        alert("Winner!");
        boardState.gameEnd = true;
    }

    drawGrid(boardState.board);
}

function showNames(){
    for(let i=0; i<boardState.group[0].length; i++){
        for(let j=0; j<4; j++){
            const box = document.getElementById(`box${i}${j}`);
            if(boardState.namesShown){
                box.style.color = "transparent";
                box.style.backgroundSize = "cover";
            }
            else{
                box.style.color = "black";
                box.style.backgroundSize = "0";
            }
        }
    }
    boardState.namesShown = !boardState.namesShown;
}
