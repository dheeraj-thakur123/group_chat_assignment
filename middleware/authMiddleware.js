const jwt = require('jsonwebtoken');
const User = require('../model/user');
// const config = require('../config/config');

module.exports  = async(req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'Authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id:decoded.id});
        console.log(user)
        if(user && user.isAdmin){
            // req.user =user;
            next();
        }else{
            return res.status(404).json({message:'Authorization denied '})
        }
    } catch (err) {
        console.log('errr==================',err)
        res.status(401).json({ message: 'Invalid token' });
    }
};