//examResultRouter
const express = require('express');
const { 
  addStudent, 
  sortAndRankStudents, 
  getAllStudents, 
  searchStudentById, 
  updateStudentDetails, 
  deleteStudent ,
  getTopRankedStudents
} = require('../controllers/examResultController');

const router = express.Router();

router.post('/students', addStudent);
router.post('/student/sort', sortAndRankStudents); 
router.get('/students', getAllStudents); 
router.get('/students/:id', searchStudentById); 
router.put('/students/:id', updateStudentDetails);
router.delete('/students/:id', deleteStudent); 
router.get('/top-students/:n', getTopRankedStudents); 

module.exports = router;
