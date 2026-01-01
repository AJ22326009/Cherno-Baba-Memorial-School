const User=require('../models/User.model');
const bcrypt=require('bcrypt');

//creating is the same as registration, so no need to create a separate function

// Get all users (only admins can access)
const getAllUsers=async(req,res)=>{
    try {
        const users= await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Error fetching users", error: error.message});
    }
}


// Get a user by ID 
const getUserById=async(req,res)=>{
    try{
        const userId=req.params.id;
        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: "Error fetching user", error: error.message});
    }
}

//delete a teacher by ID (only admins can do this)
const deleteTeacher=async(req,res)=>{
    try{
        const userId=req.params.id;
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "user not found"});
        }
        if(user.role!=='teacher'){
            return res.status(400).json({message: "User is not a teacher"});
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({message: "Teacher deleted successfully"});
    }catch(error){
        res.status(500).json({message: "Error deleting teacher", error: error.message});
    }
}

//update password
const updatePassword=async(req,res)=>{
    try {
        const userId=req.params.id;
        const {current, newPassword}=req.body;
        if(current==='' || newPassword===''){
            return res.status(400).json({message: "Please provide both current and new passwords"});
        }
        if(current ==='' && newPassword===''){
            return res.status(400).json({message: "current password maintained (no changes made)"});
        }

        const isMatch=await bcrypt.compare(current, req.user.password);

        if(!isMatch){
            return res.status(400).json({message: "Current password is incorrect"});
        }

        const hashedPassword=await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, {password: hashedPassword});
        res.status(200).json({message: "Password updated successfully"});
    } catch (error) {
        res.status(500).json({message: "Error updating password", error: error.message});
    }
}

module.exports={getAllUsers,getUserById,deleteTeacher, updatePassword};
