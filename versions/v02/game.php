<?php
session_start();

function start() {
    $words = ['apple', 'berry', 'stare', 'mango', 'grape'];
    $word = $words[array_rand($words)];
    $_SESSION['word'] = $word;
    $_SESSION['guesses'] = 6;
    $_SESSION['guessed_letters'] = [];
    $_SESSION['score'] = 0;
}

function guess($letter) {
    if (!isset($_SESSION['word']) || !isset($_SESSION['guesses'])) {
        return ['error' => 'No game in progress'];
    }

    if ($_SESSION['guesses'] <= 0) {
        return ['error' => 'No guesses remaining'];
    }

    if (in_array($letter, $_SESSION['guessed_letters'])) {
        return ['error' => 'Letter already guessed'];
    }

    $_SESSION['guessed_letters'][] = $letter;
    $_SESSION['guesses']--;

    if (strpos($_SESSION['word'], $letter) !== false) {
        $_SESSION['score'] += 10;  // Increment score only for correct guesses
    }

    return get_state();
}


function get_state() {
    if (!isset($_SESSION['word']) || !isset($_SESSION['guesses'])) {
        return ['error' => 'No game in progress'];
    }

    $word = $_SESSION['word'];
    $guessed_letters = $_SESSION['guessed_letters'];
    $remaining_guesses = $_SESSION['guesses'];
    $display_word = '';
    $letter_states = [];

    foreach (str_split($word) as $letter) {
        if (in_array($letter, $guessed_letters)) {
            $display_word .= $letter;
            $letter_states[] = 'correct';
        } else {
            $display_word .= '_';
            $letter_states[] = 'absent';
        }
    }

    foreach ($guessed_letters as $letter) {
        if (strpos($word, $letter) !== false && !in_array($letter, $letter_states)) {
            $key = array_search($letter, str_split($word));
            if ($key !== false) {
                $letter_states[$key] = 'present';
            }
        }
    }

    if ($display_word == $word) {
        update_leaderboard($_SESSION['score']);
    }

    return [
        'word' => $display_word,
        'remaining_guesses' => $remaining_guesses,
        'guessed_letters' => $guessed_letters,
        'letter_states' => $letter_states,
        'score' => $_SESSION['score']
    ];
}


function update_leaderboard($score) {
    if (!isset($_SESSION['leaderboard'])) {
        $_SESSION['leaderboard'] = [];
    }

    $_SESSION['leaderboard'][] = $score;
    rsort($_SESSION['leaderboard']);
    $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
}

function get_leaderboard() {
    return isset($_SESSION['leaderboard']) ? $_SESSION['leaderboard'] : [];
}

$action = $_GET['action'] ?? '';
$response = ['error' => 'Invalid action'];

switch ($action) {
    case 'start':
        start();
        $response = get_state();
        break;
    case 'guess':
        if (isset($_GET['letter'])) {
            $response = guess($_GET['letter']);
        }
        break;
    case 'state':
        $response = get_state();
        break;
    case 'leaderboard':
        $response = get_leaderboard();
        break;
}

header('Content-Type: application/json');
echo json_encode($response);
?>
