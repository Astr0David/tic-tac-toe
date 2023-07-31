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
  }

  function toggleOneActiveClass(targetBtn) {
    playerOneBtns.forEach((btn) => {
      btn.classList.toggle('active', btn === targetBtn);
    });
  }

  function toggleTwoActiveClass(targetBtn) {
    playerTwoBtns.forEach((btn) => {
      btn.classList.toggle('active', btn === targetBtn);
    });
  }

  function updateImage(playerNumber, playerType) {
    const imageUrl = playerImages[`${playerNumber}`][playerType];

    let imageContainer;

    if (playerNumber === "player1") {
      imageContainer = imageContainers[0];
    } else {
      imageContainer = imageContainers[1];
    }

    const playerImage = imageContainer.querySelector('img');

    playerImage.src = imageUrl;
    playerImage.style.display = 'initial';
  }


  function handleButtonClickOne(event) {
    const clickedBtn = event.target;
    if (!clickedBtn.classList.contains('active')) {
      toggleOneActiveClass(clickedBtn);

      const [playerNumber, playerType] = clickedBtn.id.split("-").filter(Boolean);

      updateImage(playerNumber, playerType);
    }
  }

  function handleButtonClickTwo(event) {
    const clickedBtn = event.target;
    if (!clickedBtn.classList.contains('active')) {
      toggleTwoActiveClass(clickedBtn);

      const [playerNumber, playerType] = clickedBtn.id.split("-").filter(Boolean);

      updateImage(playerNumber, playerType);
    }
  }

  document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('player-one-btn')) {
      handleButtonClickOne(event);
    } else if (target.classList.contains('player-two-btn')) {
      handleButtonClickTwo(event);
    }
  });
}

initialisePlayers()