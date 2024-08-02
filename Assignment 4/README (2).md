# Hospital Triage Application

## Overview
The Hospital Triage Application is designed to assist hospital staff in managing emergency room patient flow. The application helps both staff and patients understand wait times and prioritizes treatment based on the severity of injuries and the length of time patients have been waiting.

## Features
- Patient Management: Staff can add patients, indicating their severity and wait time.
- Patient Status Check: Patients and staff can check the status of any patient by name.
- Administrative View: A full list of patients is displayed for administrative use, sorted by severity and wait time.

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: PostgreSQL

## Installation
### Prerequisites
- Web Server: Apache, Nginx, or similar with PHP support
- PHP: Version 7.4 or higher
- PostgreSQL: Version 9.5 or higher

## Setup
Clone the Repository: 
```
git clone https://github.com/ellitraboulsi/emergency_waitlist.git
cd emergency_waitlist
```

## Database Setup
Create a PostgreSQL database and a user with appropriate permissions.
Use the following SQL script to create the necessary table:

```
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    wait_time INTEGER NOT NULL
);
```

## Configure the Database Connection
Update the server.php file with your database credentials:
```
$host = 'your_host';
$dbname = 'your_dbname';
$username = 'your_username';
$password = 'your_password';
```

## Run the Application
- Place the project files in your web server's root directory.
- Access the application via your web browser.

## Usage
### Adding Patients
- Click the "Add Patient" button.
- Enter the patient's name, severity level (low, medium, high), and wait time in minutes.
- Checking Patient Status
- Enter the patient's name in the "Check Status" section.
- Click the "Check Status" button to view the patient's details.
  
### Viewing All Patients
- The main table displays all patients, sorted by severity and wait time.

### Contact
If you have any questions or need further assistance, please contact etrab069@uottawa.ca or __.
______________________________________________

This README provides an overview of the project, instructions for setup and usage. Be sure to replace placeholders like yourusername, your_host, your_dbname, your_username, your_password, and yourname@example.com with your actual information.
