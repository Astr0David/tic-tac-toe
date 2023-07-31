function initialisePlayers() {
  const playerOneBtns = document.querySelectorAll('.player-one-btn');
  const playerTwoBtns = document.querySelectorAll('.player-two-btn');
  const imageContainers = document.querySelectorAll('.player_one_image, .player_two_image');

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

  function toggleActiveClass(playerBtns, targetBtn) {
    playerBtns.forEach((btn) => {
      btn.classList.toggle('active', btn === targetBtn);
    });
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
      updateImage(playerNumber, playerType);
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

initialisePlayers();
