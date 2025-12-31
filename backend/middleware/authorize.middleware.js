const authorize= (role) => {
    return (req, res, next) => {

        if(!req.user){
            return res.status(401).json({ message: 'user not logged in' });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ message: 'forbidden access' });
        }

        next();
    }
};

const onlyParticularUser= (req, res, next) => {
    const userId=req.params.id;

    if(!req.user){
        return res.status(401).json({ message: 'user not logged in' });
    }

    if (req.user.userId !== userId) {
        return res.status(403).json({ message: 'forbidden access' });
    }

    next();
}

const classTeacherAndAdmin=(req,res,next)=>{
    if(!req.user){
        return res.status(401).json({ message: 'user not logged in' });
    }

    const assignedClass=req.user.assignedClass;

    if(req.body.classLevel !== assignedClass && req.user.role==='teacher'){
        return res.status(403).json({ message: 'forbidden access: You can only do this to your assigned class' });
    }

    next();
}

const classTeacherOnly=(req,res,next)=>{
    if(!req.user){
        return res.status(401).json({ message: 'user not logged in' });
    }

    const assignedClass=req.user.assignedClass;

    if(req.body.classLevel !== assignedClass){
        return res.status(403).json({ message: 'forbidden access: You can only do this to your assigned class' });
    }

    next();
}

module.exports={authorize, onlyParticularUser, classTeacherAndAdmin, classTeacherOnly};