function initialisePlayers() {
  const playerOneBtns = document.querySelectorAll('.player-one-btn');
  const playerTwoBtns = document.querySelectorAll('.player-two-btn');
  const imageContainers = document.querySelectorAll('.player_one_image, .player_two_image');
  const skillDropdownOne = document.getElementById('aiskillchoiceone')
  const skillDropdownTwo = document.getElementById('aiskillchoicetwo')
  const startBtn = document.getElementById("start-game");

  const playerImages = {
    'player1': {
      human: 'player1.jpg',
      bot: 'botprofile1.png'
    },
    'player2': {
      human: 'player2.jpg',
      bot: 'botprofile2.png'
    }
  };

  const playerElements = {
    "player1": skillDropdownOne,
    "player2": skillDropdownTwo,
  };

  let playerTypes = {
    "player1": null,
    "player2": null,
  };

  function checkStartButton() {
    startBtn.style.display = Object.values(playerTypes).every((type) => type !== null) ? "block" : "none";
  }

  function toggleActiveClass(playerBtns, targetBtn) {
    playerBtns.forEach((btn) => {
      btn.classList.toggle('active', btn === targetBtn);
    });
  }

  function botDropdown(playerNumber, playerType) {
    const targetElement = playerElements[playerNumber];
    targetElement.style.display = playerType === "bot" ? "flex" : "none";
  }

  function updateImage(playerNumber, playerType) {
    const imageUrl = playerImages[playerNumber][playerType];
    const imageContainer = playerNumber === "player1" ? 0 : 1;
    const playerImage = imageContainers[imageContainer].querySelector('img');

    playerImage.src = imageUrl;
    playerImage.style.display = 'initial';
  }

  function handleButtonClick(event, playerBtns) {
    const clickedBtn = event.target;
    if (!clickedBtn.classList.contains('active')) {
      toggleActiveClass(playerBtns, clickedBtn);

      const [playerNumber, playerType] = clickedBtn.id.split("-").filter(Boolean);

      playerTypes[playerNumber] = playerType;

      updateImage(playerNumber, playerType);
      botDropdown(playerNumber, playerType);
      checkStartButton();
    }
  }

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('player-one-btn')) {
      handleButtonClick(event, playerOneBtns);
    } else if (target.classList.contains('player-two-btn')) {
      handleButtonClick(event, playerTwoBtns);
    }
  });
}

function startGame() {
  const gameContainer = document.querySelector(".game_container");
  const startContainer = document.querySelector(".start_container");

  function displayGame() {
    startContainer.style.display = "none";
    gameContainer.style.display = "flex";
  }

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.id === "start-game") {
      displayGame()
    }
  });
}

function mainGame() {
  const tiles = document.querySelectorAll(".tic-tac-tile");
  const text = document.querySelector(".who-turn-container");

  const positions = new Array(9).fill(undefined);

  let gameEnded = false;

  let count = 1;

  updateTurnText();

  function takeTurn(index) {
    if (!gameEnded && !positions[index]) {
      const symbol = count % 2 === 0 ? "O" : "X";
      tiles[index].innerHTML = symbol;
      positions[index] = symbol.toLowerCase();
      count++;

      setTimeout(() => {
        if (!checkWinner()) {
          checkDraw();
        }
      }, 0);

      updateTurnText();
    }
  }

  function handleClick(index) {
    takeTurn(index);
  }

  tiles.forEach((tile, index) => tile.addEventListener("click", () => handleClick(index)));

  function whichWinner(value) {
    text.innerHTML = `Player ${value.toUpperCase()} Wins!`;
    tiles.forEach((tile, index) => tile.removeEventListener("click", handleClick));
    gameEnded = true;
  }

  function checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (positions[a] === positions[b] && positions[b] === positions[c]) {
        whichWinner(positions[a]);
        return true;
      }
    }

    return false;
  }


  function checkDraw() {
    if (positions.every(pos => pos)) {
      text.innerHTML = "It is a Tie."
      tiles.forEach((tile, index) => tile.removeEventListener("click", handleClick));
      gameEnded = true;
    }
  }

  function updateTurnText() {
    const currentPlayer = count % 2 === 0 ? "Player 2" : "Player 1";
    text.innerHTML = `${currentPlayer} has their turn.`;
  }
}


initialisePlayers();

startGame();

mainGame();