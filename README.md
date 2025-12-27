# Anonymous Grading Web Application

## Objective

Develop a web application that allows student projects to be graded by anonymous peer juries, ensuring fairness and transparency in the evaluation process.

## Description

This application enables students to submit projects and have them evaluated by anonymous colleagues.  
The system ensures that graders remain anonymous and that final grades are calculated objectively.

The application follows a **Single Page Application (SPA)** architecture and is accessible via modern web browsers on desktop, tablet, or mobile devices.

## Technologies Used

- Frontend: React
- Backend: Node.js, Express
- Database: MariaDB (via Sequelize)
- API Communication: REST

## Functionalities

### Student
- Register and log in as a student
- Add a project with description, video link, and deployment link
- Automatically become eligible to evaluate other projects
- Grade projects anonymously
- Modify own grades within a limited time window

### Grading System
- Each project is graded by multiple anonymous peers
- Grades range from **1 to 10**, with up to **two decimal places**
- The final grade is calculated using a **trimmed mean**:
  - Highest and lowest grades are removed
  - Remaining grades are averaged

### Professor
- View all submitted projects
- View final grades for each project
- Cannot see the identity of jury members
- Cannot modify grades (ensures anonymity and fairness)

### Permissions
- Only assigned jury members can grade a project
- Users can only modify their own grades
- Grade modification is time-limited

## How to Run the Application

1. Start the backend:
   ```bash
   cd back-end
   npm install
   npm start
