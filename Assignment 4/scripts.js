document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-patient-button').addEventListener('click', addPatient);
    document.getElementById('check-status-button').addEventListener('click', checkStatus);
});

function addPatient() {
    let patientName = prompt("Enter patient's name:");
    let severity = prompt("Enter severity level (low, medium, high):");
    let waitTime = prompt("Enter wait time in minutes:");

    if (!patientName || !severity || !waitTime || isNaN(waitTime)) {
        alert("Please enter valid patient information.");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert('Patient added successfully');
            fetchPatients();
        }
    };
    xhr.send(`action=add&name=${encodeURIComponent(patientName)}&severity=${encodeURIComponent(severity)}&waitTime=${encodeURIComponent(waitTime)}`);
}

function checkStatus() {
    let patientName = document.getElementById('patient-name').value.trim();

    if (!patientName) {
        alert("Please enter your name to check status.");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `server.php?action=check&name=${encodeURIComponent(patientName)}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // On success, display patient status
            let response = JSON.parse(xhr.responseText);
            if (response.status === 'found') {
                document.getElementById('status-result').innerText = `Status: ${response.message}`;
            } else {
                document.getElementById('status-result').innerText = 'Patient not found.';
            }
        }
    };
    xhr.send();
}

function fetchPatients() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'server.php?action=list', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Update the patient table with the data received from the server
            let patients = JSON.parse(xhr.responseText);
            let tbody = document.querySelector('#patient-table tbody');
            tbody.innerHTML = ''; 

            patients.forEach(patient => {
                let row = tbody.insertRow();
                row.insertCell(0).innerText = patient.name;
                row.insertCell(1).innerText = patient.severity;
                row.insertCell(2).innerText = patient.waitTime;
                let actionCell = row.insertCell(3);
                actionCell.innerHTML = `<button onclick="removePatient('${patient.name}')">Remove</button>`;
            });
        }
    };
    xhr.send();
}

function removePatient(patientName) {
    if (!confirm(`Are you sure you want to remove ${patientName}?`)) {
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert('Patient removed successfully');
            fetchPatients();
        }
    };
    xhr.send(`action=remove&name=${encodeURIComponent(patientName)}`);
}

fetchPatients();
