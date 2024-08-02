<?php
// server.php

// Database connection setup
$host = 'localhost';
$dbname = 'hospital_triage';
$username = 'your_db_username'; // Needs to be changed once downloaded
$password = 'your_db_password'; // Needs to be changed once downloaded

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit();
}

// Handle AJAX requests
$action = $_REQUEST['action'] ?? '';

switch ($action) {
    case 'add':
        addPatient($pdo);
        break;
    case 'list':
        listPatients($pdo);
        break;
    case 'check':
        checkStatus($pdo);
        break;
    case 'remove':
        removePatient($pdo);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

function addPatient($pdo) {
    $name = $_POST['name'] ?? '';
    $severity = $_POST['severity'] ?? '';
    $waitTime = $_POST['waitTime'] ?? 0;

    if (empty($name) || empty($severity) || !is_numeric($waitTime)) {
        echo json_encode(['error' => 'Invalid input']);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO patients (name, severity, wait_time) VALUES (:name, :severity, :waitTime)");
        $stmt->execute(['name' => $name, 'severity' => $severity, 'waitTime' => (int)$waitTime]);
        echo json_encode(['success' => 'Patient added successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to add patient: ' . $e->getMessage()]);
    }
}

function listPatients($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM patients ORDER BY severity DESC, wait_time ASC");
        $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($patients);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch patients: ' . $e->getMessage()]);
    }
}

function checkStatus($pdo) {
    $name = $_GET['name'] ?? '';

    if (empty($name)) {
        echo json_encode(['error' => 'No patient name provided']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM patients WHERE name = :name");
        $stmt->execute(['name' => $name]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($patient) {
            echo json_encode(['status' => 'found', 'message' => 'Patient found: ' . $patient['name'] . ', Severity: ' . $patient['severity']]);
        } else {
            echo json_encode(['status' => 'not_found', 'message' => 'Patient not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to check patient status: ' . $e->getMessage()]);
    }
}

function removePatient($pdo) {
    $name = $_POST['name'] ?? '';

    if (empty($name)) {
        echo json_encode(['error' => 'No patient name provided']);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM patients WHERE name = :name");
        $stmt->execute(['name' => $name]);
        echo json_encode(['success' => 'Patient removed successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to remove patient: ' . $e->getMessage()]);
    }
}
