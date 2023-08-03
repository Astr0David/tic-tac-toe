const initialisePlayers = (() => {
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

  const playerTypes = {
    "player1": null,
    "player2": null,
  };

  const checkStartButton = () => {
    startBtn.style.display = Object.values(playerTypes).every((type) => type !== null) ? "block" : "none";
  };

  const toggleActiveClass = (playerBtns, targetBtn) => {
    playerBtns.forEach((btn) => {
      btn.classList.toggle('active', btn === targetBtn);
    });
  };

  const botDropdown = (playerNumber, playerType) => {
    const targetElement = playerElements[playerNumber];
    targetElement.style.display = playerType === "bot" ? "flex" : "none";
  };

  const updateImage = (playerNumber, playerType) => {
    const imageUrl = playerImages[playerNumber][playerType];
    const imageContainer = playerNumber === "player1" ? 0 : 1;
    const playerImage = imageContainers[imageContainer].querySelector('img');

    playerImage.src = imageUrl;
    playerImage.style.display = 'initial';
  };

  const handleButtonClick = (event, playerBtns) => {
    const clickedBtn = event.target;
    if (!clickedBtn.classList.contains('active')) {
      toggleActiveClass(playerBtns, clickedBtn);

      const [playerNumber, playerType] = clickedBtn.id.split("-").filter(Boolean);

      playerTypes[playerNumber] = playerType;

      updateImage(playerNumber, playerType);
      botDropdown(playerNumber, playerType);
      checkStartButton();
    }
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('player-one-btn')) {
      handleButtonClick(event, playerOneBtns);
    } else if (target.classList.contains('player-two-btn')) {
      handleButtonClick(event, playerTwoBtns);
    }
  });
})();

const startGame = (() => {
  const gameContainer = document.querySelector(".game_container");
  const startContainer = document.querySelector(".start_container");

  const displayGame = () => {
    startContainer.style.display = "none";
    gameContainer.style.display = "flex";
  }

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.id === "start-game") {
      displayGame()
      gameController.startGames()
    }
  });
})();

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""]

  const getBoard = () => board;

  const makeMove = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    } else {
      return false;
    }
  };

  const checkWin = (marker) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === board[b] && board[b] === board[c]) {
        if (board[a] === marker) {
          return true
        }
      }
    }
    return false;
  };

  const checkTie = () => {
    if (board.every(pos => pos)) {
      return true
    } else {
      return false
    }
  };

  const resetBoard = () => {
    board.fill("");
  };

  return {
    getBoard,
    makeMove,
    checkWin,
    checkTie,
    resetBoard,
  };
})();

const playerFactory = (name, marker) => {
  return { name, marker };
};

const displayController = (() => {
  const cells = document.querySelectorAll('.tic-tac-tile');
  const replayBtn = document.getElementById("replay");
  const startBtn = document.getElementById("back");
  const start = document.querySelector(".start_container")
  const gameContainer = document.querySelector(".game_container")

  const renderBoard = (board) => {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  function replayGame() {
    gameController.startGames()
  }

  function startGameAgain() {
    start.style.display = "flex";
    gameContainer.style.display = "none"
  }

  const showWinner = (winner) => {
    const text = document.querySelector(".who-turn-container");
    text.innerHTML = `${winner.name} has Won!`;
    replayBtn.style.display = "block";
    startBtn.style.display = "block";
    replayBtn.addEventListener("click", replayGame)
    startBtn.addEventListener("click", startGameAgain);
  };

  const showTie = () => {
    const text = document.querySelector(".who-turn-container");
    text.innerHTML = "It's a Tie.";
    replayBtn.style.display = "block";
    startBtn.style.display = "block";
    replayBtn.addEventListener("click", replayGame);
    startBtn.addEventListener("click", startGameAgain);
  };

  const enableCellClicks = (callback) => {
    cells.forEach((cell) => {
      cell.addEventListener('click', callback);
    });
  };

  const disableCellClicks = () => {
    cells.forEach((cell) => {
      cell.removeEventListener('click', callback);
    });
  };

  return {
    renderBoard,
    showWinner,
    showTie,
    enableCellClicks,
    disableCellClicks,
  };
})();

const gameController = (() => {
  let currentPlayer;
  let isGameOver = false;

  const text = document.querySelector(".who-turn-container");
  const playerOneName = document.querySelector(".player_one_name");
  const playerTwoName = document.querySelector(".player_two_name");
  const replayBtn = document.getElementById("replay");
  const startBtn = document.getElementById("back");

  const startGames = () => {
    const p1name = playerOneName.value || "Player 1";
    const p2name = playerTwoName.value || "Player 2";
    replayBtn.style.display = "none";
    startBtn.style.display = "none";

    player1 = playerFactory(p1name, 'X');
    player2 = playerFactory(p2name, 'O');

    currentPlayer = player1;
    text.innerHTML = `${currentPlayer.name} has their turn.`;
    isGameOver = false;
    gameBoard.resetBoard();
    displayController.renderBoard(gameBoard.getBoard());
    displayController.enableCellClicks(handleCellClick);
  };

  const handleCellClick = (event) => {
    if (!isGameOver) {
      const cellIndex = Number(event.target.id);

      if (gameBoard.makeMove(cellIndex, currentPlayer.marker)) {
        displayController.renderBoard(gameBoard.getBoard());

        if (gameBoard.checkWin(currentPlayer.marker)) {
          displayController.showWinner(currentPlayer);
          isGameOver = true;
        } else if (gameBoard.checkTie()) {
          displayController.showTie();
          isGameOver = true;
        } else {
          currentPlayer = currentPlayer === player1 ? player2 : player1;
          text.innerHTML = `${currentPlayer.name} has their turn.`;
        }
      }
    }
  };

  return {
    startGames,
  };
})();

