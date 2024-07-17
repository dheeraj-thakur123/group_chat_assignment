const express = require('express');
const userController=require('../controller/userController');
const authController = require('../middleware/authMiddleware');
const Router = express.Router();

Router.post('/createUser',authController,userController.registerUser);
Router.post('/updateUser',authController,userController.updateUser);
Router.get('/getAllUser',userController.getAllUsers);
// Router.get('/logout',authHandler,userController.getAllUsers);

module.exports = Router;