<?php
session_start();

<<<<<<< HEAD
$words = ['apple', 'berry', 'stare', 'mango', 'grape'];
$leaderboardFile = 'leaderboard.json';

// Load leaderboard from file
if (file_exists($leaderboardFile)) {
    $leaderboard = json_decode(file_get_contents($leaderboardFile), true);
} else {
    $leaderboard = [];
}
=======
$words = ['apple', 'berry', 'stare', 'mango', 'grape', 'bread', 'crane', 'stare', 'cloud', 'pinky', 'store', 'chart'];
>>>>>>> 00519c8f1cf49ab5513f7009783ef1922be587e4

if (!isset($_SESSION['secret_word'])) {
    $_SESSION['secret_word'] = $words[array_rand($words)];
    $_SESSION['attempts'] = [];
}

$secret_word = $_SESSION['secret_word'];
$attempts = $_SESSION['attempts'];

function checkWord($attempt, $secret_word) {
    $result = [];
    for ($i = 0; $i < strlen($attempt); $i++) {
        if ($attempt[$i] === $secret_word[$i]) {
            $result[] = 'correct';
        } elseif (strpos($secret_word, $attempt[$i]) !== false) {
            $result[] = 'present';
        } else {
            $result[] = 'absent';
        }
    }
    return $result;
}

function updateLeaderboard(&$leaderboard, $word, $score) {
    $leaderboard[] = ['word' => $word, 'score' => $score];
    usort($leaderboard, function ($a, $b) {
        return $b['score'] - $a['score'];
    });
    $leaderboard = array_slice($leaderboard, 0, 10);
}

$response = ['status' => '', 'attempts' => $attempts, 'leaderboard' => $leaderboard];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['guess']) && strlen($input['guess']) === 5) {
        $guess = strtolower($input['guess']);
        $attempts[] = ['guess' => $guess, 'result' => checkWord($guess, $secret_word)];
        $_SESSION['attempts'] = $attempts;

        if ($guess === $secret_word) {
            $remaining_attempts = 6 - count($attempts);
            updateLeaderboard($leaderboard, $secret_word, $remaining_attempts);
            file_put_contents($leaderboardFile, json_encode($leaderboard)); // Save leaderboard to file
            $response['status'] = 'won';
            $response['secret_word'] = $secret_word;
            session_destroy();
        } elseif (count($attempts) >= 6) {
            $response['status'] = 'lost';
            $response['secret_word'] = $secret_word;
            session_destroy();
        } else {
            $response['status'] = 'ongoing';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Invalid guess';
    }
}

$response['attempts'] = $attempts;
$response['leaderboard'] = $leaderboard; // Return the leaderboard from the session
echo json_encode($response);
?>
