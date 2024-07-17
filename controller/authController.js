const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const genrateToken = require('../config/gentrateToken');
// const config = require('../config/config');
//JWT Secret

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({message:'Please enter valid username or password.'})
    }
    try {
        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        user = new User({ username, password,isAdmin:true });
        await user.save();
        return res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({message:'Please enter valid username or password.'})
    }
    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        const token = genrateToken(user._id)
        res.status(200).json({ token ,user});
       
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

exports.logoutUser = async (req, res) => {
    // Implementation for user logout (if needed)
    try {
         return res.status(200).json({ message: 'User logged out successfully' });
    } catch (err) {
        console.error(err.message);
       return res.status(500).send('Server Error');
    }
};
