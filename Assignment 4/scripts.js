document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-patient-button').addEventListener('click', addPatient);
    document.getElementById('check-status-button').addEventListener('click', checkStatus);
    fetchPatients();
});

function addPatient() {
    let name = document.getElementById('patient-name').value;
    let severity = document.getElementById('severity').value;
    let waitTime = document.getElementById('wait-time').value;

    if (!name || !severity || !waitTime || isNaN(waitTime)) {
        alert("Please enter valid patient information.");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert('Patient added successfully');
            fetchPatients();
        }
    };
    xhr.send(`action=add&name=${encodeURIComponent(name)}&severity=${encodeURIComponent(severity)}&waitTime=${encodeURIComponent(waitTime)}`);
}

function checkStatus() {
    let name = document.getElementById('user-name').value;
    let code = document.getElementById('user-code').value;

    if (!name || !code) {
        alert("Please enter your name and 3-letter code.");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('status-result').innerText = xhr.responseText;
        }
    };
    xhr.send(`action=checkStatus&name=${encodeURIComponent(name)}&code=${encodeURIComponent(code)}`);
}

function fetchPatients() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/server.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let patients = JSON.parse(xhr.responseText);
            let tbody = document.getElementById('patient-table').getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';

            patients.forEach(function(patient) {
                let row = tbody.insertRow();
                row.insertCell(0).innerText = patient.name;
                row.insertCell(1).innerText = patient.severity;
                row.insertCell(2).innerText = patient.wait_time;
            });
        }
    };
    xhr.send('action=fetch');
}
