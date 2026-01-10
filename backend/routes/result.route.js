const express = require('express');
const router = express.Router();
const {authorize, classTeacherOnly}=require('../middleware/authorize.middleware');

const {createResult, generateClassPositions, searchResults, getResultsByClass, deleteResult, editResult} = require('../controllers/result.controller');

//create a new result
router.post('/', authorize('teacher'),createResult);

//generate class positions for a particular class and term
router.post('/positions', authorize('teacher'), classTeacherOnly, generateClassPositions);

//get all results [only admin]
router.get('/search/:name', authorize('admin'), searchResults);

//get results in a class
router.get('/class/:classLevel', getResultsByClass);

router.delete('/:id', deleteResult);

//edit a result
router.put('/:id', editResult);

module.exports = router;