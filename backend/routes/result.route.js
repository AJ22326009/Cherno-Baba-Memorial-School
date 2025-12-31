const express = require('express');
const router = express.Router();
const {authorize, classTeacherOnly, classTeacherAndAdmin}=require('../middleware/authorize.middleware');

const {createResult, generateClassPositions, getResultsByStudent, getResultsByClassTermYear, getAllResults} = require('../controllers/result.controller');

//create a new result
router.post('/', authorize('teacher'),createResult);

//generate class positions for a particular class, term and academic year
router.post('/positions', authorize('teacher'), classTeacherOnly, generateClassPositions);

//get all results of a particular student (authorization should be handled in controller)
router.get('/student/:studentId', getResultsByStudent);

//get all results of a particular class, term and academic year (authorization should be handled in controller)
router.get('/class',getResultsByClassTermYear);

//get all results [only admin]
router.get('/', authorize('admin'), getAllResults);

module.exports = router;