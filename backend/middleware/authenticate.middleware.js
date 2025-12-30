const jwt=require('jsonwebtoken');

const authenticate = (req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message:'no token provided'});
    }

    const token=authHeader.split(' ')[1];

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json({message:'invalid token'});
    }
}

module.exports=authenticate;