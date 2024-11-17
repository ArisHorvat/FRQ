const boardState = {
    guess: "",
    currentRow: 0,
    currentCol: 0,
    rightBoxes: 0,
    isWinner: false,
    animation: false
};

function startWordle() {
    const board = document.getElementById('board');
    populateGrid(boardState.word);
    drawGrid(board);
    addKeysEventListener();
}

document.addEventListener('DOMContentLoaded', async(event) => {
    await choosePlayer();
    startWordle();
})
  

document.addEventListener('keydown', (event) => {
    let key = event.key;
    if(boardState.isWinner)
        return;
    if(key == "Enter"){
        if(boardState.animation == false)
            checkWord();
    }
    if(key == "Backspace"){
        if(boardState.animation == false)
            removeLetter();
    }
    if(key.length == 1){
        if(boardState.animation == false)
            if(key.toLowerCase() >= "a" && key.toLowerCase() <= "z"){
                addLetter(key.toLowerCase());
            }
    }
})

async function choosePlayer(){
    try{
        const response = await fetch("http://localhost:3000/api/wordle-player");
        const data = await response.json();
        boardState.player = data[0];
        
        let playerName = boardState.player.Name.split(" ");
        let lastName = "";
        for(let i=1; i<playerName.length; i++){
            lastName += playerName[i];
            if(playerName.length - i > 1)
                lastName += " ";
        }

        boardState.word = lastName.toLowerCase();
    }
    catch(error){
        alert(error.message)
    }
}

function populateGrid(word){
    boardState.grid = [];
    for(let i=0; i<word.length; i++){
        let row = [];
        for(let i=0; i<6; i++){
            row.push('');
        }
        boardState.grid.push(row);
    }
}

function drawGrid(board) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.style.gridTemplateColumns = `repeat(${boardState.word.length}, auto)`;
  let nrSpecial = 0;

  for (let i = 0; i < 6; i++) {
    nrSpecial = 0;
    for (let j = 0; j < boardState.word.length; j++) {
        if(boardState.word[j] == " "){
            drawBox(grid, i, j - nrSpecial, "space");
            nrSpecial++;
        }
        else if(boardState.word[j] == "'"){
            drawBox(grid, i, j - nrSpecial, "'");
            nrSpecial++;
        }
        else if(boardState.word[j] == "."){
            drawBox(grid, i, j - nrSpecial, ".");
            nrSpecial++;
        }
        else if(boardState.word[j] == "-"){
            drawBox(grid, i, j - nrSpecial, "-");
            nrSpecial++;
        }
        else{
            drawBox(grid, i, j - nrSpecial, '');
        }
    }
  }
  boardState.nrSpecial = nrSpecial;

  board.appendChild(grid);
}

function drawBox(grid, row, col, letter) {
    const box = document.createElement('div');
    box.className = 'box';
    if(letter == "space"){
        box.textContent = "";
        box.style.width = "30px";
    }
    else if(letter == "'"){
        box.textContent = "'";
        box.style.width = "30px";
    }
    else if(letter == "."){
        box.textContent = "";
        box.style.width = "30px";
    }
    else if(letter == "-"){
        box.textContent = "-";
        box.style.width = "30px";
    }
    else{
        box.textContent = letter;
        box.id = `box${row}${col}`;
        box.style.backgroundImage = "url('LETTERS/empty.png')";
    }

    grid.appendChild(box);
    return box;
}

function addLetter(letter){
    if(boardState.currentCol != boardState.word.length - boardState.nrSpecial){
        let box = document.getElementById(`box${boardState.currentRow}${boardState.currentCol}`);
        box.textContent = letter;

        boardState.guess += letter;
        boardState.currentCol += 1;
    }
}

function removeLetter(){
    if(boardState.currentCol > 0){
        boardState.currentCol -= 1;
        boardState.guess = boardState.guess.slice(0, -1);

        let box = document.getElementById(`box${boardState.currentRow}${boardState.currentCol}`);
        box.textContent = '';
    }
}

function checkWord(){
    if(boardState.currentCol == boardState.word.length - boardState.nrSpecial){
        boardState.animation = true;
        boardState.rightBoxes = 0;
        
        let row=boardState.currentRow;
        let word=boardState.word;
        let guess=boardState.guess;
        
        let guessDict = populateDict(guess);
        let wordDict = populateDict(word);
        let nrSpecial = 0;


        for(let i=0; i<word.length - boardState.nrSpecial; i++){
            let box = document.getElementById(`box${row}${i}`);
            if(word[i + nrSpecial] == " " || word[i + nrSpecial] == "'" || word[i + nrSpecial] == "." || word[i + nrSpecial] == "-")
                nrSpecial++;

            if(word[i + nrSpecial] == box.textContent){
                box.classList.add('right');
                boardState.rightBoxes++;
                changeButtonColor(word[i + nrSpecial], 'right');

                wordDict[box.textContent] -= 1;
                guessDict[box.textContent] -= 1;
                word = word.substring(0,i + nrSpecial) + '-' + word.substring(i+nrSpecial+1);
                guess = guess.substring(0,i) + '-' + guess.substring(i+1);

                box.classList.add('animate');
                box.style.animationDelay = `${i * 0.15}s`;
                box.addEventListener('animationend', handleAnimationEnd, { once: true });                
            }
        }
        
        for(let i=0; i<word.length - boardState.nrSpecial; i++){
            let box = document.getElementById(`box${row}${i}`);

            if(box.classList.contains('right'))
                continue;

            if(guess[i] in wordDict){
                if(wordDict[box.textContent] == 0){
                    box.classList.add('empty');
                    changeButtonColor(guess[i], 'empty');
                }
                else{
                    box.classList.add('partial');
                    changeButtonColor(guess[i], 'partial');

                    wordDict[box.textContent] -= 1;
                    guessDict[box.textContent] -= 1;
                }
            }
            else{
                box.classList.add('empty');
                changeButtonColor(guess[i], 'empty');
            }
            box.classList.add('animate');
            box.style.animationDelay = `${i * 0.15}s`;
            box.addEventListener('animationend', handleAnimationEnd, { once: true });
        }
    }
}

function populateDict(word){
    let dictionary = {}
    let letter = '';
    for(let i=0; i<word.length; i++){
        letter = word[i];
        if(letter in dictionary){
            dictionary[letter] += 1;
        }
        else{
            dictionary[letter] = 1;
        }
    }
    return dictionary;
}


function handleAnimationEnd(event){
    event.target.removeEventListener('animationend', handleAnimationEnd);
    event.target.classList.remove('animate');
    if(event.target.classList.contains('right')){        
        event.target.style.backgroundImage = "url('LETTERS/right.png')";;
    }
    else if(event.target.classList.contains('partial')){
        event.target.style.backgroundImage = "url('LETTERS/partial.png')";;
    }
    else{
        event.target.style.backgroundImage = "url('LETTERS/wrong.png')";;
    }

    if (boardState.animation == true) {
        checkWin();
    }
}

function changeButtonColor(key, keyClass){
    let button = document.getElementById(key);
    const buttonStyle = getComputedStyle(button).backgroundColor;
    if(buttonStyle == 'rgb(0,128,0)'){
        return;
    }
    else if(buttonStyle == 'rgb(255, 255, 0)'){
        if(keyClass == 'right'){
            button.style.backgroundColor = 'green';
            button.classList.add('animateButton');
            button.animationDelay = `0.5s`;
        }
        else if(keyClass == 'partial'){
            return;
        }
    }
    else if(buttonStyle == 'rgb(128, 128, 0)'){
        return;
    }
    else if(buttonStyle == 'rgb(255, 255, 255)'){
        if(keyClass == 'right'){
            button.style.backgroundColor = 'green';
            button.classList.add('animateButton');
            button.animationDelay = `0.5s`;
        }
        else if(keyClass == 'partial'){
            button.style.backgroundColor = 'yellow';
        }
        else{
            button.style.backgroundColor = 'grey';
        }
    }
}

function addKeysEventListener(){
    let button;
    for(let i=97; i<=122; i++){
        button = document.getElementById(String.fromCharCode(i));
        button.addEventListener('click', () => {
            if(boardState.isWinner)
                return;
            if(boardState.animation == false)
                addLetter(String.fromCharCode(i));
        });
    }
    
    button = document.getElementById("delete");
    button.addEventListener('click', () => {
        if(boardState.isWinner)
            return;
        if(boardState.animation == false)
            removeLetter();
    });

    button = document.getElementById("enter");
    button.addEventListener('click', () => {
        if(boardState.isWinner)
            return;
        if(boardState.animation == false)
            checkWord();
    });
}

function checkWin(){
    if(boardState.rightBoxes == boardState.word.length - boardState.nrSpecial){
        let popup = document.getElementById("popup");
        let container = document.getElementById("container");
        let close = document.getElementById("closePopup");
        let mesaj = document.getElementById("resultMessage");
        let jersey = document.getElementById("playerJersey");
        let mesajWin = `Congratulations! The player was ${boardState.player.Name}`;

        popup.classList.add("show");
        container.classList.add("blurred");
        mesaj.innerHTML = mesajWin;
        jersey.style.backgroundImage = "url('" + boardState.player.Jersey +"')";
        boardState.isWinner = true;

        close.addEventListener("click", ()=>{
            popup.classList.remove("show");
            container.classList.remove("blurred");
        })
    }
    else if(boardState.currentRow == 5){
        let popup = document.getElementById("popup");
        let container = document.getElementById("container");
        let close = document.getElementById("closePopup");
        let mesaj = document.getElementById("resultMessage");
        let jersey = document.getElementById("playerJersey");
        let mesajLose = `The player was ${boardState.player.Name}`

        popup.classList.add("show");
        container.classList.add("blurred");
        mesaj.innerHTML = mesajLose;
        jersey.style.backgroundImage = "url('" + boardState.player.Jersey +"')";

        close.addEventListener("click", ()=>{
            popup.classList.remove("show");
            container.classList.remove("blurred");
        })
    }
    boardState.currentRow += 1;
    boardState.currentCol = 0;
    boardState.guess = "";
    boardState.animation = false;
}
