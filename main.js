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



initialisePlayers();

startGame()