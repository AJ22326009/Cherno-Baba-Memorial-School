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

module.exports={authorize, onlyParticularUser};