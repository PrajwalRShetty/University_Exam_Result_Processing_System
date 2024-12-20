// server.js
const fs = require('fs');
const path = require('path');
const express = require('express');
const examResultRouter = require('./routers/examResultRouter'); // Ensure this file exists and has valid routes
const ExamResultService = require('./services/examResultService');

// Initialize express app
const app = express();
app.use(express.json());

const studentsFilePath = path.join(__dirname, 'students_data.json');

function loadStudentsData() {
  try {
    const fileData = fs.readFileSync(studentsFilePath, 'utf-8');
    if (!fileData.trim()) {
      console.log("students_data.json is empty. No data loaded.");
      return []; // Return an empty array if the file is empty
    }
    return JSON.parse(fileData); // Parse and return JSON data if it's valid
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log("students_data.json file does not exist. Creating a new one.");
      return []; // Return an empty array if file doesn't exist
    }
    console.error("Error reading or parsing the file:", error);
    return []; // Return an empty array on error
  }
}

// Load student data when the app starts
const data = loadStudentsData();

if (data && Array.isArray(data)) {
  data.forEach(student => {
    const existingStudent = ExamResultService.searchStudentById(student.id);
    if (!existingStudent) {
      ExamResultService.addStudent(student.id, student.name, student.scores);
    }
  });
  console.log('All students loaded into the service.');
} else {
  console.error("Failed to load student data or data is not in the correct format.");
}

app.use('/api', examResultRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
