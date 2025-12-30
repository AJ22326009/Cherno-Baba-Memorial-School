const express = require('express');
const router = express.Router();
const {createStudent, getAllStudents, getStudentById, getStudentsByClassLevel, updateStudent, deleteStudent} = require('../controllers/student.controller');
const {authorize}=require('../middleware/authorize.middleware');

//create a new student
router.post('/', authorize('admin'), createStudent);

//get all students
router.get('/', authorize('admin'), getAllStudents);

//get all students from a particular class level
router.get('/class/:classLevel', getStudentsByClassLevel);

//get a student by ID
router.get('/:id', authorize('admin'), getStudentById);

//update a student by ID
router.put('/:id', authorize('admin'), updateStudent);

//delete a student by ID
router.delete('/:id', authorize('admin'), deleteStudent);


module.exports = router;



