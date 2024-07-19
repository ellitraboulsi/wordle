document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const board = document.getElementById('board');
    const keyboard = document.getElementById('keyboard');
    const leaderboardList = document.getElementById('leaderboard-list');

    startButton.addEventListener('click', startGame);

    function startGame() {
        startButton.style.display = 'none';  // Hide the start button
        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action: 'start'})
        })
        .then(response => response.json())
        .then(state => {
            updateGameState(state);
            fetchLeaderboard(); // Fetch and display the leaderboard after starting the game
        })
        .catch(error => console.error('Error starting game:', error));
    }

    function handleKeyPress(key) {
        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({guess: key})
        })
        .then(response => response.json())
        .then(state => {
            updateGameState(state);
            fetchLeaderboard(); // Fetch and display the leaderboard after each guess
        })
        .catch(error => console.error('Error handling key press:', error));
    }

    function updateGameState(state) {
        if (state.error) {
            alert(state.error);
            return;
        }

        updateBoard(state.attempts);
    }

    function updateBoard(attempts) {
        board.innerHTML = '';
        attempts.forEach(attempt => {
            const row = document.createElement('div');
            row.classList.add('row');
            attempt.result.forEach((status, i) => {
                const square = document.createElement('div');
                square.classList.add('square', status);
                square.textContent = attempt.guess[i];
                row.appendChild(square);
            });
            board.appendChild(row);
        });

        keyboard.innerHTML = '';
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.classList.add('key');
            keyElement.textContent = key;
            keyElement.addEventListener('click', () => handleKeyPress(key.toLowerCase()));
            keyboard.appendChild(keyElement);
        });
    }

    function fetchLeaderboard() {
        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action: 'leaderboard'})
        })
        .then(response => response.json())
        .then(updateLeaderboard)
        .catch(error => console.error('Error fetching leaderboard:', error));
    }

    function updateLeaderboard(leaderboard) {
        leaderboardList.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. Word: ${entry.word}, Score: ${entry.score}`;
            leaderboardList.appendChild(listItem);
        });
    }
});
