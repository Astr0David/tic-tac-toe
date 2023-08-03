const initializePlayers = (() => {
  const playerOneBtns = document.querySelectorAll('.player-one-btn');
  const playerTwoBtns = document.querySelectorAll('.player-two-btn');
  const imageContainers = document.querySelectorAll('.player_one_image, .player_two_image');
  const skillDropdownOne = document.getElementById('aiskillchoiceone');
  const skillDropdownTwo = document.getElementById('aiskillchoicetwo');
  const startBtn = document.getElementById("start-game");

  const playerImages = {
    'player1': { human: 'player1.jpg', bot: 'botprofile1.png' },
    'player2': { human: 'player2.jpg', bot: 'botprofile2.png' }
  };

  const playerElements = { "player1": skillDropdownOne, "player2": skillDropdownTwo };
  const playerTypes = { "player1": null, "player2": null };

  const checkStartButton = () => {
    startBtn.style.display = Object.values(playerTypes).every(type => type !== null) ? "block" : "none";
  };

  const toggleActiveClass = (playerBtns, targetBtn) => {
    playerBtns.forEach(btn => btn.classList.toggle('active', btn === targetBtn));
  };

  const botDropdown = (playerNumber, playerType) => {
    playerElements[playerNumber].style.display = playerType === "bot" ? "flex" : "none";
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
  };

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.id === "start-game") {
      displayGame();
      gameController.startGames();
    }
  });
})();

const gameBoard = (() => {
  let board = Array(9).fill('');
  let availableMoves = Array.from(Array(9).keys());
  let isGameOver = false;

  const makeMove = (index, marker) => {
    if (!isGameOver && board[index] === '') {
      board[index] = marker;
      availableMoves = availableMoves.filter(move => move !== index);
      return true;
    }
    return false;
  };

  const getBoard = () => board;

  const checkWin = (marker) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === board[b] && board[b] === board[c] && board[a] === marker) {
        return true;
      }
    }
    return false;
  };

  const checkTie = () => board.every(pos => pos);

  const getAvailableMoves = () => availableMoves;

  const resetBoard = () => {
    board = Array(9).fill('');
    availableMoves = Array.from(Array(9).keys());
    isGameOver = false;
  };

  return { makeMove, getBoard, resetBoard, checkWin, checkTie, getAvailableMoves };
})();

const playerFactory = (name, marker, isAI) => ({ name, marker, isAI });

const displayController = (() => {
  const cells = document.querySelectorAll('.tic-tac-tile');
  const replayBtn = document.getElementById("replay");
  const startBtn = document.getElementById("back");
  const start = document.querySelector(".start_container");
  const gameContainer = document.querySelector(".game_container");

  const renderBoard = (board) => cells.forEach((cell, index) => cell.textContent = board[index]);

  const replayGame = () => gameController.startGames();

  const startGameAgain = () => {
    start.style.display = "flex";
    gameContainer.style.display = "none";
  };

  const showWinner = (winner) => {
    const text = document.querySelector(".who-turn-container");
    text.innerHTML = `${winner.name} has Won!`;
    replayBtn.style.display = "block";
    startBtn.style.display = "block";
    replayBtn.addEventListener("click", replayGame);
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

  const enableCellClicks = (callback) => cells.forEach(cell => cell.addEventListener('click', event => callback(event)));

  const disableCellClicks = (callback) => cells.forEach(cell => cell.removeEventListener('click', callback));

  return { renderBoard, showWinner, showTie, enableCellClicks, disableCellClicks };
})();

const gameController = (() => {
  let currentPlayer;
  let isGameOver = false;

  const text = document.querySelector(".who-turn-container");
  const playerOneName = document.querySelector(".player_one_name");
  const playerTwoName = document.querySelector(".player_two_name");
  const playerOneAI = document.getElementById("player1-bot");
  const playerTwoAI = document.getElementById("player2-bot");
  const replayBtn = document.getElementById("replay");
  const startBtn = document.getElementById("back");

  const updateAIPlayers = (p1name, p2name) => {
    const skillSelect1 = document.getElementById("skillselect1");
    const skillSelect2 = document.getElementById("skillselect2");

    const isPlayerOneAI = playerOneAI.classList.contains('active');
    const isPlayerTwoAI = playerTwoAI.classList.contains('active');

    const aiSkill1 = skillSelect1.value;
    const aiSkill2 = skillSelect2.value;

    const issPlayerOneAI = aiSkill1 === 'impossible';
    const issPlayerTwoAI = aiSkill2 === 'impossible';

    player1 = issPlayerOneAI ? unbeatableAIPlayer(p1name, 'X') : (isPlayerOneAI ? playerFactory(p1name, 'X', true) : playerFactory(p1name, 'X', false));
    player2 = issPlayerTwoAI ? unbeatableAIPlayer(p2name, 'O') : (isPlayerTwoAI ? playerFactory(p2name, 'O', true) : playerFactory(p2name, 'O', false));
  };

  const startGames = () => {
    const p1name = playerOneName.value || "Player 1";
    const p2name = playerTwoName.value || "Player 2";

    replayBtn.style.display = "none";
    startBtn.style.display = "none";

    updateAIPlayers(p1name, p2name);

    currentPlayer = player1;
    text.innerHTML = `${currentPlayer.name} has their turn.`;
    isGameOver = false;
    gameBoard.resetBoard();
    displayController.renderBoard(gameBoard.getBoard());
    displayController.enableCellClicks(handleCellClick);

    if (currentPlayer.isAI) {
      disableClicksAndMakeAIMove();
    } else {
      displayController.enableCellClicks(handleCellClick);
    }
  };

  const makeAIMove = () => {
    if (!isGameOver && currentPlayer.isAI) {
      const availableMoves = gameBoard.getAvailableMoves();
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const selectedMove = availableMoves[randomIndex];

      gameBoard.makeMove(selectedMove, currentPlayer.marker);
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

        setTimeout(makeAIMove, 500);
      }
    }
  };

  const disableClicksAndMakeAIMove = () => {
    displayController.disableCellClicks(handleCellClick);
    setTimeout(makeAIMove, 500);
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
          if (currentPlayer.isAI) {
            disableClicksAndMakeAIMove();
          } else {
            displayController.enableCellClicks(handleCellClick);
          }
        }
      }
    }
  };

  return { startGames };
})();

const unbeatableAIPlayer = (name, marker) => {
  const aiName = name;
  const isAI = true;

  const minimax = (board, depth, maximizingPlayer, alpha, beta) => {
    if (gameBoard.checkWin(player1.marker)) return -10 + depth;
    if (gameBoard.checkWin(player2.marker)) return 10 - depth;
    if (gameBoard.checkTie()) return 0;

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of gameBoard.getAvailableMoves()) {
        gameBoard.makeMove(move, player2.marker);
        const eval = minimax(board, depth + 1, false, alpha, beta);
        gameBoard.makeMove(move, "");
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of gameBoard.getAvailableMoves()) {
        gameBoard.makeMove(move, player1.marker);
        const eval = minimax(board, depth + 1, true, alpha, beta);
        gameBoard.makeMove(move, "");
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const makeMove = () => {
    let bestScore = -Infinity;
    let bestMove;

    for (const move of gameBoard.getAvailableMoves()) {
      gameBoard.makeMove(move, marker);
      const score = minimax(gameBoard.getBoard(), 0, false, -Infinity, Infinity);
      gameBoard.makeMove(move, "");
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    gameBoard.makeMove(bestMove, marker);
    displayController.renderBoard(gameBoard.getBoard());
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    text.innerHTML = `${currentPlayer.name} has their turn.`;
    if (currentPlayer.isAI) {
      disableClicksAndMakeAIMove();
    } else {
      displayController.enableCellClicks(handleCellClick);
    }

    if (gameBoard.checkWin(marker)) {
      displayController.showWinner(player2);
      isGameOver = true;
    } else if (gameBoard.checkTie()) {
      displayController.showTie();
      isGameOver = true;
    }
  };

  return { name: aiName, isAI, makeMove, marker };
};
