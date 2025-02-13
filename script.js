document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('gameContainer');
  const startButton = document.getElementById('startButton');
  const difficultySelect = document.getElementById('difficulty');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const hintButton = document.getElementById('hintButton');
  const flipSound = document.getElementById('flipSound');
  const matchSound = document.getElementById('matchSound');
  const nomatchSound = document.getElementById('nomatchSound');

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let score = 0;
  let matchesFound = 0;
  let totalPairs = 0;
  let timer;
  let secondsElapsed = 0;

  const cardValues = [
    '🍎', '🍌', '🍇', '🍒', '🍉', '🥝', '🍍', '🍑',
    '🍋', '🍓', '🍈', '🥭', '🍐', '🥥', '🍏', '🍊'
  ];

  startButton.addEventListener('click', startGame);

  hintButton.addEventListener('click', revealAllCardsBriefly);

  function startGame() {
    clearInterval(timer);
    secondsElapsed = 0;
    timerDisplay.textContent = `Time: 0s`;
    score = 0;
    matchesFound = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameContainer.innerHTML = '';

    const difficulty = difficultySelect.value;
    if (difficulty === 'easy') {
      totalPairs = 8;
    } else if (difficulty === 'medium') {
      totalPairs = 12;
    } else if (difficulty === 'hard') {
      totalPairs = 16;
    }

    let selectedValues = cardValues.slice(0, totalPairs);
    let gameCards = [...selectedValues, ...selectedValues];

    gameCards.sort(() => 0.5 - Math.random());

    gameCards.forEach((value) => {
      const card = createCardElement(value);
      gameContainer.appendChild(card);
    });

    timer = setInterval(() => {
      secondsElapsed++;
      timerDisplay.textContent = `Time: ${secondsElapsed}s`;
    }, 1000);
  }

  function createCardElement(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');

    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    cardBack.textContent = value;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => flipCard(card));
    return card;
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard) return;

    flipSound.currentTime = 0;
    flipSound.play();

    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      matchSound.currentTime = 0;
      matchSound.play();
      disableCards();
      score += 10;
      matchesFound++;
      scoreDisplay.textContent = `Score: ${score}`;

      if (matchesFound === totalPairs) {
        endGame();
      }
    } else {
      nomatchSound.currentTime = 0;
      nomatchSound.play();
      score -= 2;
      scoreDisplay.textContent = `Score: ${score}`;
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
  }

  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function endGame() {
    clearInterval(timer);
    setTimeout(() => {
      alert(
        `Congratulations! You completed the game in ${secondsElapsed} seconds with a score of ${score}.`
      );
    }, 300);
  }

  function revealAllCardsBriefly() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card) => {
      if (!card.classList.contains('flipped')) {
        card.classList.add('flipped');
      }
    });
    setTimeout(() => {
      allCards.forEach((card) => {
        if (!card.dataset.matched) {
          card.classList.remove('flipped');
        }
      });
    }, 1000);
  }
});
