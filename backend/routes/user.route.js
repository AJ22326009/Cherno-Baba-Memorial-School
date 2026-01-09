const {getAllUsers, getUserById, deleteTeacher, updatePassword, updateUser}=require('../controllers/User.controller');
const {authorize, onlyParticularUser}=require('../middleware/authorize.middleware');

const express=require('express');
const router=express.Router();

// Route to get all users (admin only)
router.get('/', authorize('admin'), getAllUsers);

// Route to get a user by ID
router.get('/:id', authorize('admin'), getUserById);

// Route to delete a teacher by ID
router.delete('/:id', authorize('admin'), deleteTeacher);

//route to update password
router.patch('/:id/password', onlyParticularUser, updatePassword);

//route for updating other user details
router.put('/:id', authorize('admin'), updateUser);

module.exports=router;