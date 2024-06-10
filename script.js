const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const words = ['apple', 'berry', 'cherry', 'mango', 'grape'];
const secretWord = words[Math.floor(Math.random() * words.length)];
let currentAttempt = '';
let attempts = [];

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    createKeyboard();
});

function createBoard() {
    const board = document.getElementById('game-board');
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            board.appendChild(tile);
        }
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const keys = 'abcdefghijklmnopqrstuvwxyz'.split('');
    keys.forEach(key => {
        const keyElement = document.createElement('button');
        keyElement.classList.add('key');
        keyElement.textContent = key;
        keyElement.addEventListener('click', () => handleKeyPress(key));
        keyboard.appendChild(keyElement);
    });
}

function handleKeyPress(key) {
    if (currentAttempt.length < WORD_LENGTH) {
        currentAttempt += key;
        updateBoard();
    }
    if (currentAttempt.length === WORD_LENGTH) {
        checkAttempt();
        currentAttempt = '';
        updateBoard();
    }
}

function updateBoard() {
    const board = document.getElementById('game-board');
    const tiles = board.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        const attemptIndex = Math.floor(index / WORD_LENGTH);
        const charIndex = index % WORD_LENGTH;
        tile.textContent = attempts[attemptIndex] ? attempts[attemptIndex][charIndex] : '';
        if (attemptIndex < attempts.length) {
            if (attempts[attemptIndex][charIndex] === secretWord[charIndex]) {
                tile.classList.add('correct');
            } else if (secretWord.includes(attempts[attemptIndex][charIndex])) {
                tile.classList.add('present');
            } else {
                tile.classList.add('absent');
            }
        }
    });
}

function checkAttempt() {
    attempts.push(currentAttempt);
    if (currentAttempt === secretWord) {
        alert('Congratulations! You guessed the word.');
        resetGame();
    } else if (attempts.length === MAX_ATTEMPTS) {
        alert(`Game over! The word was ${secretWord}.`);
        resetGame();
    }
}

function resetGame() {
    attempts = [];
    currentAttempt = '';
    secretWord = words[Math.floor(Math.random() * words.length)];
    updateBoard();
}
