document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const board = document.getElementById('board');
    const keyboard = document.getElementById('keyboard');
    const leaderboardList = document.getElementById('leaderboard-list');

    startButton.addEventListener('click', startGame);

    function startGame() {
        startButton.style.display = 'none';  // Hide the start button
        fetch('game.php?action=start')
            .then(response => response.json())
            .then(updateGameState)
            .then(fetchLeaderboard);
    }


    function handleKeyPress(key) {
        fetch(`game.php?action=guess&letter=${key}`)
            .then(response => response.json())
            .then(updateGameState)
            .then(fetchLeaderboard);
    }

    function updateGameState(state) {
        if (state.error) {
            alert(state.error);
            return;
        }

        updateBoard(state.word, state.guessed_letters);
    }

    function updateBoard(displayWord, guessedLetters) {
        board.innerHTML = '';
        for (let i = 0; i < displayWord.length; i++) {
            let square = document.createElement('div');
            square.classList.add('square', 'tile');
            square.textContent = displayWord[i] === '_' ? '' : displayWord[i];
            board.appendChild(square);
        }

        keyboard.innerHTML = '';
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.classList.add('key');
            keyElement.textContent = key;
            if (guessedLetters.includes(key.toLowerCase())) {
                keyElement.disabled = true;
            } else {
                keyElement.addEventListener('click', () => handleKeyPress(key.toLowerCase()));
            }
            keyboard.appendChild(keyElement);
        });
    }

    function fetchLeaderboard() {
        fetch('game.php?action=leaderboard')
            .then(response => response.json())
            .then(updateLeaderboard);
    }

    function updateLeaderboard(leaderboard) {
        leaderboardList.innerHTML = '';
        leaderboard.forEach((score, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${score}`;
            leaderboardList.appendChild(listItem);
        });
    }
});
