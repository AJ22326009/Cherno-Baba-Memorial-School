const express = require('express');
const router = express.Router();
const {authorize}=require('../middleware/authorize.middleware');

const {createResult, generateClassPositions, getResultsByStudent, getResultsByClassTermYear, getAllResults} = require('../controllers/result.controller');

//create a new result
router.post('/', authorize('teacher'),createResult);

//generate class positions for a particular class, term and academic year
router.post('/positions', authorize('teacher'), generateClassPositions);

//get all results of a particular student
router.get('/student/:studentId',authorize('teacher'), getResultsByStudent);

//get all results of a particular class, term and academic year
router.get('/class', authorize('teacher'), getResultsByClassTermYear);

//get all results [only admin]
router.get('/', authorize('admin'), getAllResults);

module.exports = router;