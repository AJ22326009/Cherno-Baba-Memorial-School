const express=require('express');
const {registerUser,loginUser}=require('../controllers/auth.controller');

const authenticate=require('../middleware/authenticate.middleware');
const {authorize}=require('../middleware/authorize.middleware');

const router=express.Router();

router.post('/register', authenticate, authorize('admin'), registerUser);
router.post('/login',loginUser);

module.exports=router;