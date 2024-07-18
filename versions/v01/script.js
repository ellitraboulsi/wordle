const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    createBoard();
    createKeyboard();
    createLeaderboard(); // Initialize the leaderboard structure
    document.addEventListener('keydown', handleKeyDown);
    updateBoard();
});

function createBoard() {
    console.log('Creating board');
    const board = document.getElementById('board');
    board.innerHTML = '';
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
    keyboard.innerHTML = '';
    const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    keys.forEach(key => {
        const keyElement = document.createElement('button');
        keyElement.classList.add('key');
        keyElement.textContent = key;
        keyElement.addEventListener('click', () => handleKeyPress(key.toLowerCase()));
        keyboard.appendChild(keyElement);
    });
}

function createLeaderboard() {
    console.log('Creating leaderboard');
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '<h2>Leaderboard</h2><ul id="leaderboard-list"></ul>';
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

let currentAttempt = '';

function handleKeyPress(key) {
    console.log(`Key pressed: ${key}`);
    if (currentAttempt.length < WORD_LENGTH) {
        currentAttempt += key;
        updateBoard();
    }
    if (currentAttempt.length === WORD_LENGTH) {
        checkAttempt();
    }
}

function updateBoard() {
    console.log('Updating board');
    fetch('game.php')
        .then(response => response.json())
        .then(data => {
            const board = document.getElementById('board');
            const tiles = board.querySelectorAll('.tile');
            let allAttempts = data.attempts;
            tiles.forEach((tile, index) => {
                const attemptIndex = Math.floor(index / WORD_LENGTH);
                const charIndex = index % WORD_LENGTH;
                if (attemptIndex === allAttempts.length) {
                    tile.textContent = currentAttempt[charIndex] || '';
                } else {
                    tile.textContent = allAttempts[attemptIndex].guess[charIndex];
                    tile.classList.remove('correct', 'present', 'absent');
                    tile.classList.add(allAttempts[attemptIndex].result[charIndex]);
                }
            });
            updateLeaderboard(data.leaderboard);
            if (data.status === 'won' || data.status === 'lost') {
                resetGame();
            }
        })
        .catch(error => console.error('Error:', error));
}


function checkAttempt() {
    console.log(`Checking attempt: ${currentAttempt}`);
    fetch('game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: currentAttempt })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'won') {
                updateLeaderboard(data.leaderboard);
                updateBoard();
                alert('Congratulations! You guessed the word.');
                resetGame();
            } else if (data.status === 'lost') {
                updateLeaderboard(data.leaderboard);
                updateBoard();
                alert(`Game over! The word was ${data.secret_word}.`);
                resetGame();
            } else {
                currentAttempt = '';
                updateBoard();
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateLeaderboard(leaderboard) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `Word: ${entry.word}, Score: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

function resetGame() {
    console.log('Resetting game');
    currentAttempt = '';
    createBoard();
    createKeyboard();
    updateBoard();
}
