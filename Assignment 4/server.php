<?php
header('Content-Type: application/json');

$host = 'your_host';
$dbname = 'your_dbname';
$username = 'your_username';
$password = 'your_password';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit();
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'add':
        addPatient($pdo);
        break;
    case 'checkStatus':
        checkStatus($pdo);
        break;
    case 'fetch':
        fetchPatients($pdo);
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
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

function checkStatus($pdo) {
    $name = $_POST['name'] ?? '';
    $code = $_POST['code'] ?? '';

    if (empty($name) || empty($code)) {
        echo json_encode(['error' => 'Invalid input']);
        return;
    }

    try {
        $stmt = $pdo->prepare("SELECT wait_time FROM patients WHERE name = :name AND LEFT(name, 3) = :code");
        $stmt->execute(['name' => $name, 'code' => $code]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($patient) {
            echo json_encode(['wait_time' => $patient['wait_time']]);
        } else {
            echo json_encode(['error' => 'Patient not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to check status: ' . $e->getMessage()]);
    }
}

function fetchPatients($pdo) {
    try {
        $stmt = $pdo->query("SELECT name, severity, wait_time FROM patients ORDER BY severity, wait_time");
        $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($patients);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch patients: ' . $e->getMessage()]);
    }
}
?>
