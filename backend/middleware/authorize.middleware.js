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
}

module.exports = authorize;