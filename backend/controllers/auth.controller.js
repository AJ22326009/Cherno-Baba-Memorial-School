const User=require('../models/User.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const registerUser=async(req,res)=>{
    try {
        const userData=req.body;
        const userExists=await User.findOne({email:userData.email});
        if(userExists){
            return res.status(400).json({message:'User already exists with this email'});
        };

        const hashedPassword=await bcrypt.hash(userData.password,10);
        userData.password=hashedPassword;
        const newUser=new User(userData);
        await newUser.save();
        res.status(201).json({message:'User registered successfully'});
    } catch (error) {
        res.status(500).json({message:'User not registered',error:error.message});
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return  res.status(400).json({message:'Invalid email'});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid password'});
        }

        const accessToken=jwt.sign({
            userId:user._id,
            name:user.name,
            role:user.role,
            email:user.email,
            assignedClass:user.assignedClass,
            imageUrl:user.imageUrl
        },
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );
        
        res.status(200).json({accessToken});
    } catch (error) {
        res.status(500).json({message:'Login failed',error:error.message});
    }
}

module.exports={registerUser,loginUser};