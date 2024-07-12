<?php
session_start();

function start() {
    $words = ['apple', 'berry', 'stare', 'mango', 'grape'];
    $word = $words[array_rand($words)];
    $_SESSION['word'] = $word;
    $_SESSION['guesses'] = 6;
    $_SESSION['guessed_letters'] = [];
}

function guess($letter) {
    if (!isset($_SESSION['word']) || !isset($_SESSION['guesses'])) {
        return ['error' => 'No game in progress'];
    }

    if ($_SESSION['guesses'] <= 0) {
        return ['error' => 'No guesses remaining'];
    }

    $_SESSION['guessed_letters'][] = $letter;
    $_SESSION['guesses']--;

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

    foreach (str_split($word) as $letter) {
        $display_word .= in_array($letter, $guessed_letters) ? $letter : '_';
    }

    return [
        'word' => $display_word,
        'remaining_guesses' => $remaining_guesses,
        'guessed_letters' => $guessed_letters,
    ];
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
}

header('Content-Type: application/json');
echo json_encode($response);
?>
