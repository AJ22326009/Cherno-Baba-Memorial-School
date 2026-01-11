const User=require('../models/User.model');
const RefreshToken=require('../models/refreshToken.model');
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

        const refreshToken=jwt.sign(
            {userId:user._id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn:'7d'}
        );
        
        await RefreshToken.create({
            user:user._id,
            token:refreshToken,
            expiresAt:new Date(Date.now()+7*24*60*60*1000)
        });

        res.status(200).json({accessToken, refreshToken});
    } catch (error) {
        res.status(500).json({message:'Login failed',error:error.message});
    }
}

const logoutUser=async (req, res) => {
    const { refreshToken } = req.body;

    await RefreshToken.deleteOne({token: refreshToken});

    res.status(200).json({ message: 'Logged out successfully' });
}

const refreshUser = async(req,res)=>{
    const {refreshToken}=req.body;

    if(!refreshToken){
        return res.status(400).json({message:'No refresh token provided'});
    }

    const storedToken=await RefreshToken.findOne({token:refreshToken});

    if(!storedToken){
        return res.status(401).json({message:'Invalid refresh token'});
    }

    try{
        const decoded=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
        const user=await User.findById(decoded.userId);

        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const newAccessToken=jwt.sign(
            {
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

        res.status(200).json({accessToken:newAccessToken});

    }catch(err){
        res.status(403).json({message:'Expired refresh token'});
    }
}

module.exports={registerUser,loginUser,logoutUser,refreshUser};