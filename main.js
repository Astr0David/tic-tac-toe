const playerOneHuman = document.getElementById("player1human");
const playerOneAi = document.getElementById("player1bot");
const playerOneImage = document.getElementById("player1pic");
const playerTwoHuman = document.getElementById("player2human");
const playerTwoAi = document.getElementById("player2bot");
const playerTwoImage = document.getElementById("player2pic");
const imageContainerOne = document.querySelector(".player_one_image");
const imageContainerTwo = document.querySelector(".player_two_image");

playerOneHuman.addEventListener("click", function () {
  if (!playerOneHuman.classList.contains("active")) {
    playerOneAi.classList.remove("active");
    playerOneHuman.classList.toggle("active");
    playerOneImage.style.display = "none";
    playerOneImage.src = "player1.jpg";
    imageContainerOne.style.padding = "0px";
    playerOneImage.style.display = "block";
  }
});

playerOneAi.addEventListener("click", function () {
  if (!playerOneAi.classList.contains("active")) {
    playerOneHuman.classList.remove("active");
    playerOneAi.classList.toggle("active");
    playerOneImage.style.display = "none";
    playerOneImage.src = "botprofile1.png";
    imageContainerOne.style.padding = "50px";
    playerOneImage.style.display = "block";
  }
});

playerTwoHuman.addEventListener("click", function () {
  if (!playerTwoHuman.classList.contains("active")) {
    playerTwoAi.classList.remove("active");
    playerTwoHuman.classList.toggle("active");
    playerTwoImage.style.display = "none";
    playerTwoImage.src = "player2.jpg";
    imageContainerTwo.style.padding = "0px";
    playerTwoImage.style.display = "block";
  }
});

playerTwoAi.addEventListener("click", function () {
  if (!playerTwoAi.classList.contains("active")) {
    playerTwoHuman.classList.remove("active");
    playerTwoAi.classList.toggle("active");
    playerTwoImage.style.display = "none";
    playerTwoImage.src = "botprofile2.png";
    imageContainerTwo.style.padding = "50px";
    playerTwoImage.style.display = "block";
  }
});
