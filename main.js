const cells = document.querySelectorAll('.tic-tac-tile');
const replayBtn = document.getElementById("replay");
const restartBtn = document.getElementById("back");
const start = document.querySelector(".start_container");
const gameContainer = document.querySelector(".game_container");
const text = document.querySelector(".who-turn-container");
const playerOneBtns = document.querySelectorAll('.player-one-btn');
const playerTwoBtns = document.querySelectorAll('.player-two-btn');
const imageContainers = document.querySelectorAll('.player_one_image, .player_two_image');
const skillDropdownOne = document.getElementById('aiskillchoiceone');
const skillDropdownTwo = document.getElementById('aiskillchoicetwo');
const startBtn = document.getElementById("start-game");
const startContainer = document.querySelector(".start_container");
const playerOneName = document.querySelector(".player_one_name");
const playerTwoName = document.querySelector(".player_two_name");
const playerOneAI = document.getElementById("player1-bot");
const playerTwoAI = document.getElementById("player2-bot");
const skillSelect1 = document.getElementById("skillselect1");
const skillSelect2 = document.getElementById("skillselect2");

const initializePlayers = (() => {
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
    let board = ["", "", "", "", "", "", "", "", ""]
    let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    const makeMove = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
            availableMoves = availableMoves.filter(move => move !== index);
            return true;
        }
        return false;
    };

    const getBoard = () => board;

    const checkWin = (board, marker) => {
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
        board = ["", "", "", "", "", "", "", "", ""];
        availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    };

    return { makeMove, getBoard, resetBoard, checkWin, checkTie, getAvailableMoves };
})();

const playerFactory = (name, marker, isAI, isImpossible) => ({ name, marker, isAI, isImpossible });

const displayController = (() => {
    const renderBoard = (board) => cells.forEach((cell, index) => cell.textContent = board[index]);

    const replayGame = () => gameController.startGames();

    const startGameAgain = () => {
        start.style.display = "flex";
        gameContainer.style.display = "none";
        restartBtn.style.display = "none";
        replayBtn.style.display = "none";
    };

    const showWinner = (winner) => {
        text.textContent = `${winner.name} has Won!`;
        replayBtn.style.display = "block";
        restartBtn.style.display = "block";
        replayBtn.addEventListener("click", replayGame);
        restartBtn.addEventListener("click", startGameAgain);
    };

    const showTie = () => {
        const text = document.querySelector(".who-turn-container");
        text.textContent = "It's a Tie.";
        replayBtn.style.display = "block";
        restartBtn.style.display = "block";
        replayBtn.addEventListener("click", replayGame);
        restartBtn.addEventListener("click", startGameAgain);
    };

    const enableCellClicks = (callback) => cells.forEach(cell => cell.addEventListener('click', callback));

    const disableCellClicks = (callback) => cells.forEach(cell => cell.removeEventListener('click', callback));

    return { renderBoard, showWinner, showTie, enableCellClicks, disableCellClicks };
})();

const gameController = (() => {
    let currentPlayer;
    let isGameOver = false;
    let player1
    let player2

    const updateAIPlayers = (p1name, p2name) => {
        const isPlayerOneAI = playerOneAI.classList.contains('active');
        const isPlayerTwoAI = playerTwoAI.classList.contains('active');

        const aiSkill1 = skillSelect1.value;
        const aiSkill2 = skillSelect2.value;

        const isAiImpossible = aiSkill1 === 'impossible';
        const IsAiImpossible2 = aiSkill2 === 'impossible';

        player1 = isAiImpossible ? playerFactory(p1name, "X", true, true) : (isPlayerOneAI ? playerFactory(p1name, 'X', true, false) : playerFactory(p1name, 'X', false, false));
        player2 = IsAiImpossible2 ? playerFactory(p2name, "O", true, true) : (isPlayerTwoAI ? playerFactory(p2name, 'O', true, false) : playerFactory(p2name, 'O', false, false));
    };

    const startGames = () => {
        const p1name = playerOneName.value || "Player 1";
        const p2name = playerTwoName.value || "Player 2";

        replayBtn.style.display = "none";
        restartBtn.style.display = "none";

        updateAIPlayers(p1name, p2name);

        currentPlayer = player1;

        text.textContent = `${currentPlayer.name} has their turn.`;

        isGameOver = false;

        gameBoard.resetBoard();

        displayController.renderBoard(gameBoard.getBoard());
        displayController.enableCellClicks(handleCellClick);

        if (currentPlayer.isAI) {
            setTimeout(makeAIMove, 500);
        } else {
            displayController.enableCellClicks(handleCellClick);
        }
    };

    const minimax = (newBoard, player) => {
        const oppositePlayer = currentPlayer.marker === "X" ? "O" : "X";

        if (gameBoard.checkWin(newBoard, oppositePlayer)) {
            return { score: -10 };
        } else if (gameBoard.checkWin(newBoard, currentPlayer.marker)) {
            return { score: 10 };
        } else if (gameBoard.checkTie(newBoard)) {
            return { score: 0 };
        }

        let moves = [];
        let availableSpots = [];

        newBoard.forEach((data, index) => {
            if (data === "") {
                availableSpots.push(index);
            }
        });

        for (let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = availableSpots[i];

            newBoard[availableSpots[i]] = player;

            if (player == currentPlayer.marker) {
                let result = minimax(newBoard, oppositePlayer);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, currentPlayer.marker);
                move.score = result.score;
            }

            newBoard[availableSpots[i]] = "";

            moves.push(move);
        }

        let bestMove;
        if (player == currentPlayer.marker) {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };


    const makeAIMove = () => {
        if (!isGameOver && currentPlayer.isAI) {
            displayController.disableCellClicks(handleCellClick);
            if (currentPlayer.isImpossible) {
                let impossibleMove = minimax(gameBoard.getBoard(), currentPlayer.marker).index;
                gameBoard.makeMove(impossibleMove, currentPlayer.marker);
            } else {
                const availableMoves = gameBoard.getAvailableMoves();
                const randomIndex = Math.floor(Math.random() * availableMoves.length);
                const selectedMove = availableMoves[randomIndex];
                gameBoard.makeMove(selectedMove, currentPlayer.marker);
            }

            displayController.renderBoard(gameBoard.getBoard());

            if (gameBoard.checkWin(gameBoard.getBoard(), currentPlayer.marker)) {
                displayController.showWinner(currentPlayer);
                isGameOver = true;
            } else if (gameBoard.checkTie()) {
                displayController.showTie();
                isGameOver = true;
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
                text.textContent = `${currentPlayer.name} has their turn.`;

                if (currentPlayer.isAI) {
                    setTimeout(makeAIMove, 500);
                } else {
                    displayController.enableCellClicks(handleCellClick);
                }
            }
        }
    };

    const handleCellClick = (event) => {
        if (!isGameOver && !currentPlayer.isAI) {
            const cellIndex = Number(event.target.id);
            if (gameBoard.makeMove(cellIndex, currentPlayer.marker)) {
                displayController.renderBoard(gameBoard.getBoard());

                if (gameBoard.checkWin(gameBoard.getBoard(), currentPlayer.marker)) {
                    displayController.showWinner(currentPlayer);
                    isGameOver = true;
                } else if (gameBoard.checkTie()) {
                    displayController.showTie();
                    isGameOver = true;
                } else {
                    currentPlayer = currentPlayer === player1 ? player2 : player1;
                    text.textContent = `${currentPlayer.name} has their turn.`;

                    if (currentPlayer.isAI) {
                        setTimeout(makeAIMove, 500);
                    } else {
                        displayController.enableCellClicks(handleCellClick);
                    }
                }
            }
        }
    };

    return { startGames };
})();

