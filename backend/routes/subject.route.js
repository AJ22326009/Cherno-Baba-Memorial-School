const {createSubject, getAllSubjects, updateSubject, deleteSubject}=require('../controllers/subject.controller');
const {authorize}=require('../middleware/authorize.middleware');

const express=require('express');
const router=express.Router();

// Route to create a new subject (admin only)
router.post('/', authorize('admin'), createSubject);

// Route to get all subjects (admin only)
router.get('/', getAllSubjects);

// Route to update a subject by ID (admin only)
router.put('/:id', authorize('admin'), updateSubject);

// Route to delete a subject by ID (admin only)
router.delete('/:id', authorize('admin'), deleteSubject);

module.exports=router;