const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const words = ['apple', 'berry', 'stare', 'mango', 'grape'];
let secretWord = words[Math.floor(Math.random() * words.length)];
let currentAttempt = '';
let attempts = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
        secretWord = words[Math.floor(Math.random() * words.length)];
        createBoard();
        createKeyboard();
        document.addEventListener('keydown', handleKeyDown);
});

function createBoard() {
    console.log('Creating board');
    const board = document.getElementById('board');
    for (let i = 0; i < WORD_LENGTH * MAX_ATTEMPTS; i++) {
        let square = document.createElement('div');
        square.classList.add('square', 'tile');
        square.setAttribute('id', i + 1);
        board.appendChild(square);
    }
}

function createKeyboard() {
    console.log('Creating keyboard');
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

function handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === 'backspace') {
        event.preventDefault();
        if (currentAttempt.length > 0) {
            currentAttempt = currentAttempt.slice(0, -1);
            updateBoard();
        }
    } else if (key.length > 1) {
        event.preventDefault();
    } else if (key >= 'a' && key <= 'z') {
        handleKeyPress(key);
    }
}

function handleKeyPress(key) {
    console.log(`Key pressed: ${key}`);
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
    console.log('Updating board');
    const board = document.getElementById('board');
    const tiles = board.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        const attemptIndex = Math.floor(index / WORD_LENGTH);
        const charIndex = index % WORD_LENGTH;
        if (attemptIndex === attempts.length) {
            tile.textContent = currentAttempt[charIndex] || '';
        } else {
            tile.textContent = attempts[attemptIndex] ? attempts[attemptIndex][charIndex] : '';
        }
        tile.classList.remove('correct', 'present', 'absent');
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
    console.log(`Checking attempt: ${currentAttempt}`);
    attempts.push(currentAttempt);
    updateBoard();
    if (currentAttempt === secretWord) {
        setTimeout(() => {
            alert('Congratulations! You guessed the word.');
            resetGame();
        }, 500); //delay to show win for dopamine
    } else if (attempts.length === MAX_ATTEMPTS) {
        setTimeout(() => {
            alert(`Game over! The word was ${secretWord}.`);
            resetGame();
        }, 500); //delay to show loss   
    }
}

function resetGame() {
    console.log('Resetting game');
    attempts = [];
    currentAttempt = '';
    secretWord = words[Math.floor(Math.random() * words.length)];
    updateBoard();
}
