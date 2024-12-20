const service = require('../services/examResultService');


const addStudent = (req, res) => {
  const { id, name, scores } = req.body;
  if (!id || !name || !scores) {
    return res.status(400).json({ error: 'Missing student details.' });
  }
  service.addStudent(id, name, scores);
  res.status(201).json({ message: 'Student added successfully.' });
};

const sortAndRankStudents = (req, res) => {
  const { criteria } = req.query;
  service.sortAndRankStudents(criteria || "total");
  res.status(200).json({ message: 'Students sorted and ranked successfully.' });
};

const getAllStudents = (req, res) => {
  const students = service.getAllStudents();
  res.status(200).json(students);
};

const searchStudentById = (req, res) => {
  const { id } = req.params;
  const student = service.searchStudentById(parseInt(id));
  if (student) {
    res.status(200).json(student);
  } else {
    res.status(404).json({ error: 'Student not gfu found.' });
  }
};

const updateStudentDetails = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedStudent = service.updateStudentDetails(parseInt(id), updates);
  if (updatedStudent) {
    res.status(200).json({ message: 'Student updated successfully.', updatedStudent });
  } else {
    res.status(404).json({ error: 'Student not found.' });
  }
};

const deleteStudent = (req, res) => {
  const { id } = req.params;
  const success = service.deleteStudent(parseInt(id));
  if (success) {
    res.status(200).json({ message: 'Student deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Student not found.' });
  }
};

const getTopRankedStudents = (req, res) => {
  // const { n } = req.query;
  const {n} = req.params;
  const topN = parseInt(n);

  if (isNaN(topN) || topN <= 0) {
    return res.status(400).json({ error: 'Invalid value for n. It must be a positive number.' });
  }

  const topStudents = service.getTopRankedStudents(topN);

  if (topStudents.length === 0) {
    return res.status(404).json({ error: 'No students found.' });
  }

  res.status(200).json(topStudents);
};


module.exports = {
  addStudent,
  sortAndRankStudents,
  getAllStudents,
  searchStudentById,
  updateStudentDetails,
  deleteStudent,
  getTopRankedStudents
};