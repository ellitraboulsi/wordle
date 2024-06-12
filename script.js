const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const words = ['apple', 'berry', 'stare', 'mango', 'grape'];
let secretWord = words[Math.floor(Math.random() * words.length)];
let currentAttempt = '';
let attempts = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    createBoard();
    createKeyboard();
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

function handleKeyPress(key) {
    console.log(`Key pressed: ${
