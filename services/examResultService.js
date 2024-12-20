// ExamResultService
const { log } = require('console');
const fs = require('fs');
const path = require('path');
const studentsFilePath = path.join(__dirname, '../students_data.json');

// Student Model
class Student {
  constructor(id, name, scores) {
    this.id = id;
    this.name = name;
    this.scores = scores;
    this.rank = null;
    this.totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  }
}

// Binary Search Tree Node
class BSTNode {
  constructor(student) {
    this.student = student;
    this.left = null;
    this.right = null;
  }
}

// Binary Search Tree Class
class BST {
  constructor() {
    this.root = null;
  }

  insert(student) {
    const newNode = new BSTNode(student);
    if (!this.root) {
      this.root = newNode;
    } else {
      this._insertNode(this.root, newNode);
    }
  }

  _insertNode(node, newNode) {
    if (newNode.student.id < node.student.id) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  search(id) {
    return this._searchNode(this.root, id);
  }

  _searchNode(node, id) {
    if (!node) return null;
    if (id === node.student.id) return node.student;
    if (id < node.student.id) return this._searchNode(node.left, id);
    return this._searchNode(node.right, id);
  }
}

// Service Class
class ExamResultService {
  constructor() {
    this.students = [];
    this.bst = new BST();
    this.loadStudentsFromFile();
  }

  loadStudentsFromFile() {
    if (fs.existsSync(studentsFilePath)) {
      try {
        const fileData = fs.readFileSync(studentsFilePath, 'utf-8');
        if (fileData.trim()) {
          this.students = JSON.parse(fileData);
          this.students.forEach(student => this.bst.insert(student));
        }
      } catch (error) {
        console.error('Error reading or parsing the file:', error);
      }
    } else {
      console.log("students_data.json file does not exist. Creating a new one.");
      this.students = []; // Initialize as an empty array if no data exists
    }
  }

  saveStudentsToFile() {
    try {
      fs.writeFileSync(studentsFilePath, JSON.stringify(this.students, null, 2));
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  }

  addStudent(id, name, scores) {
    const student = new Student(id, name, scores);
    this.students.push(student);
    this.bst.insert(student); // Insert into BST
    this.saveStudentsToFile(); 
  }

  sortAndRankStudents(criteria = "total") {
    if (criteria === "total") {
      this.students.sort((a, b) => b.totalScore - a.totalScore || a.name.localeCompare(b.name));
    } else {
      this.students.sort((a, b) => b.scores[criteria] - a.scores[criteria] || a.name.localeCompare(b.name));
    }

    for (let i = 0; i < this.students.length; i++) {
      this.students[i].rank = i + 1;
    }

    this.saveStudentsToFile();
  }

  searchStudentById(id) {
    return this.bst.search(id);
  }

  getAllStudents() {
    return this.students;
  }

  updateStudentDetails(id, updates) {
    const studentIndex = this.students.findIndex(student => student.id === id);
    if (studentIndex === -1) return null;

    const student = this.students[studentIndex];
    Object.assign(student, updates);

    if (updates.scores) {
      student.totalScore = Object.values(student.scores).reduce((sum, score) => sum + score, 0);
    }

    this.saveStudentsToFile();
    return student;
  }

  deleteStudent(id) {
    const studentIndex = this.students.findIndex(student => student.id === id);
    if (studentIndex === -1) return false;

    this.students.splice(studentIndex, 1);
    this.saveStudentsToFile();
    return true;
  }

  getTopRankedStudents(n) {

    this.sortAndRankStudents();
    
    function loadStudentsData() {
      try {
        const fileData = fs.readFileSync(studentsFilePath, 'utf-8');
        if (!fileData.trim()) {
          console.log("students_data.json is empty. No data loaded.");
          return []; 
        }
        return JSON.parse(fileData);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log("students_data.json file does not exist. Creating a new one.");
          return []; 
        }
        console.error("Error reading or parsing the file:", error);
        return []; 
      }
    }
    
    let data = []
    data = loadStudentsData();
    return data.slice(0,n);
  }
}

module.exports = new ExamResultService();
