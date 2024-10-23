import {players, getJersey, getName, getPosition, getTeam, getAge, getNumber, getConference, getDivision} from "../players.js";

const boardState = {
  misteryPlayer: players.baltimore[58],
  guesses: [],
  gameEnd: false,
  animation: false,
  namesShown: false,
  offense: ["QB", "RB", "FB", "WR", "TE", "OC", "OG", "OT"],
  defense: ["DT", "DE", "OLB", "ILB", "CB", "S"],
  st: ["K", "P", "LS"],
};


function startGuessWho(){
    const board = document.getElementById('board');  

    drawJerseyDropDown(board);
    drawGuessColumn(board);

    let searchBar = document.getElementById("search");
    searchBar.addEventListener("keyup", filterFunction);
    searchBar.addEventListener("keydown", handleNavigation);
}

document.addEventListener('DOMContentLoaded', (event) => {
    startGuessWho();
})

function drawGuessColumn(board){
    const guessColumn = document.createElement("div");
    guessColumn.id = "guessColumn";
    guessColumn.className = "guessColumn";

    board.appendChild(guessColumn);
}

function drawJerseyDropDown(board){
    let jdd = document.createElement("div");
    jdd.className = "jdd";

    let jersey = document.createElement("div");
    jersey.className = "jersey";
    jersey.id = "jerseyPlayer";
    jdd.appendChild(jersey);

    let dropDown = document.createElement("div");
    dropDown.id = "dropDown";
    dropDown.className = "dropDown-content";

    let search = document.createElement("input");
    search.type = "text";
    search.placeholder="Guess 1 of 8";
    search.autocomplete="off";
    search.id = "search";
    dropDown.appendChild(search);

    jdd.appendChild(dropDown);

    board.appendChild(jdd);
}

function populateDropDown(filter){
    let numberOfPlayers = 0;
    let dropDown = document.getElementById("dropDown");
    let div = document.createElement("div");
    div.id = "playersDiv";

    for(var team in players){
      for(var player in players[team]){
        let txtValue = getName(players[team][player]);
        if(txtValue.toUpperCase().indexOf(filter) > -1) {
          if(numberOfPlayers == 0)
            dropDown.appendChild(div);
          let playerTag = document.createElement("a");
          let playerJersey = document.createElement("img");
          let playerName = document.createElement("span");
          let currentPlayer = players[team][player];
          playerTag.className = "dropDown-player";

          playerJersey.src = getJersey(currentPlayer);
          playerTag.appendChild(playerJersey);

          playerName.innerText = getName(currentPlayer);
          playerTag.appendChild(playerName);

          playerTag.onclick = function(){
            checkGuess(currentPlayer);
          }
          div.appendChild(playerTag);
          numberOfPlayers++;
        }
      }
    }
}

function clearDropDown(){
    let dropDown = document.getElementById("dropDown");
    while(dropDown.children.length != 1){
      let player = dropDown.children[dropDown.children.length - 1];
      dropDown.removeChild(player);
    }
}

function filterFunction(event) {
  var input, filter, div, a, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  div = document.getElementById("dropDown");
  
  if(filter.length >= 3){
    clearDropDown();
    populateDropDown(filter);
  }
  else{
    clearDropDown();
  }
}

function checkGuess(player){
  if(boardState.guesses.includes(player)){
    return;
  }

  let guessColumn = document.getElementById("guessColumn");

  let jerseyImage = document.createElement("div");
  jerseyImage.style.backgroundImage = "url(" + getJersey(player) + ")";
  jerseyImage.className = "guess";
  jerseyImage.classList.add("animate");
  jerseyImage.style.animationDelay = "0.2s";
  

  let conference = document.createElement("div");
  conference.style.backgroundImage = "url(" + getConference(player) + ")";
  conference.innerHTML = getDivision(player);
  conference.className = "guess";
  conference.classList.add("animate");
  conference.style.animationDelay = "0.4s";

  let position = document.createElement("div");
  position.innerHTML = getPosition(player);
  position.className = "guess";
  position.style.fontSize = "3.3vw";
  position.classList.add("animate");
  position.style.animationDelay = "0.6s";

  let number = document.createElement("div");
  number.innerHTML = getNumber(player);
  number.className = "guess";
  number.style.fontSize = "3.3vw";
  number.classList.add("animate");
  number.style.animationDelay = "0.8s";

  let age = document.createElement("div");
  age.innerHTML = getAge(player);
  age.className = "guess";
  age.style.fontSize = "3.3vw";
  age.classList.add("animate");
  age.style.animationDelay = "1s";

  let guesses = document.getElementsByClassName("guess");
  for(let i=0; i<guesses.length; i++){
    guesses[i].addEventListener("animation-end", ()=>{
      guesses[i].classList.remove("animate");
    })
  }

  if(getName(player) == getName(boardState.misteryPlayer)){
    jerseyImage.style.backgroundColor = "green";
    conference.style.backgroundColor = "green";
    position.style.backgroundColor = "green";
    number.style.backgroundColor = "green";
    age.style.backgroundColor = "green";

    let jersey = document.getElementById("jerseyPlayer");
    jersey.style.backgroundImage = "url(" + getJersey(player) + ")";
  }
  else{
    if(getTeam(player) == getTeam(boardState.misteryPlayer)){
      jerseyImage.style.backgroundColor = "yellow";
    }
    else{
      jerseyImage.style.backgroundColor = "grey";
    }

    if(getConference(player) == getConference(boardState.misteryPlayer)){
      if(getDivision(player) == getDivision(boardState.misteryPlayer)){
        conference.style.backgroundColor = "green";
      }
      else{
        conference.style.backgroundColor = "yellow";
      }
    }
    else{
      conference.style.backgroundColor = "grey";
    }

    if(getPosition(player) == getPosition(boardState.misteryPlayer)){
      position.style.backgroundColor = "green";
    }
    else{
      let posPlayer = getPosition(player);
      let posMistery = getPosition(boardState.misteryPlayer);
      if((boardState.offense.includes(posPlayer) && boardState.offense.includes(posMistery)) || (boardState.defense.includes(posPlayer) && boardState.defense.includes(posMistery)) || (boardState.st.includes(posPlayer) && boardState.st.includes(posMistery))){
        position.style.backgroundColor = "yellow";
      }
      else{
        position.style.backgroundColor = "grey";
      }
    }

    let numberPlayer = getNumber(player);
    let numberMistery = getNumber(boardState.misteryPlayer);
    if(numberPlayer == numberMistery){
      number.style.backgroundColor = "green";
    }
    else{
      if(numberPlayer > numberMistery){
        number.innerHTML += "\u2193"; //upwards = 2191
        if(numberPlayer - numberMistery <= 2){
          number.style.backgroundColor = "yellow";
        }
        else{
          number.style.backgroundColor = "grey";
        }
      }
      else{
        number.innerHTML += "\u2191"; //downwards = 2193
        if(numberMistery - numberPlayer <= 2){
          number.style.backgroundColor = "yellow";
        }
        else{
          number.style.backgroundColor = "grey";
        }
      }
    }

    let agePlayer = getAge(player);
    let ageMistery = getAge(boardState.misteryPlayer);
    if(agePlayer == ageMistery){
      age.style.backgroundColor = "green";
    }
    else{
      if(agePlayer > ageMistery){
        age.innerHTML += "\u2193";
        if(agePlayer - ageMistery <= 2){
          age.style.backgroundColor = "yellow";
        }
        else{
          age.style.backgroundColor = "grey";
        }
      }
      else{
        age.innerHTML += "\u2191";
        if(ageMistery - agePlayer <= 2){
          age.style.backgroundColor = "yellow";
        }
        else{
          age.style.backgroundColor = "grey";
        }
      }
    }

  }

  guessColumn.appendChild(jerseyImage);
  guessColumn.appendChild(conference);
  guessColumn.appendChild(position);
  guessColumn.appendChild(number);
  guessColumn.appendChild(age);

  let jerseyName = document.createElement("div");
  jerseyName.innerHTML = "Jersey";
  jerseyName.className = "topRowGuess";
  guessColumn.appendChild(jerseyName);

  let conferenceName = document.createElement("div");
  conferenceName.innerHTML = "Conference/Division";
  conferenceName.className = "topRowGuess";
  guessColumn.appendChild(conferenceName);

  let positionName = document.createElement("div");
  positionName.innerHTML = "Position";
  positionName.className = "topRowGuess";
  guessColumn.appendChild(positionName);

  let numberName = document.createElement("div");
  numberName.innerHTML = "Number";
  numberName.className = "topRowGuess";
  guessColumn.appendChild(numberName);

  let ageName = document.createElement("div");
  ageName.innerHTML = "Age";
  ageName.className = "topRowGuess";
  guessColumn.appendChild(ageName);

  boardState.guesses.push(player);

  let searchBar = document.getElementById("search");
  searchBar.placeholder = "Guess " + (boardState.guesses.length + 1).toString() + " of 8";
  searchBar.value = "";
  clearDropDown();
}
