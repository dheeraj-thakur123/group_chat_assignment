const express = require('express');
const groupController=require('../controller/groupController');
// const {authHandler}=require('../middleware/authMiddlewalre');
const Router = express.Router();

Router.post('/createGroup',groupController.createGroup);
Router.post('/addUserToGroup',groupController.addUserToGroup);
Router.delete('/deleteGroup',groupController.deleteGroup);
Router.post('/sendMessage',groupController.sendMessage);
Router.post('/likeMessgae',groupController.likeMessage);

module.exports = Router;