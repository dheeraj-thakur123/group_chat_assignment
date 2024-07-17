const expressAsyncHandler = require("express-async-handler");
const User = require("../model/user");
// const genrateToken=require("../Config/genrateToken");
module.exports = {
  registerUser : expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    try {
      if(!username || !password){
        return res.status(400).json({message:'Missing required fields.'})
      }
      // Check if user already exists
      const userExist = await User.findOne({ username });
      if (userExist) {
        return res.status(400).json({
          status: 'error',
          message: 'Username already exists',
        });
      }
      console.log(username,password)
      // Create new user
      const newUser = await User.create({username,password})
      console.log(newUser)
      // Respond with success
      res.status(200).json({
        message: 'User created successfully',
        newUser
      });
    } catch (error) {
      console.log(error)
      // Handle other errors
      console.error('Error creating user:', error);
      return res.status(500).json({
        message: 'Server error.',
      });
    }
  }),

  updateUser:expressAsyncHandler(async(req,res)=>{
    try {
      let {userId,username} = req.body;
      if(!userId || !username){
        return res.status(404).json({message:'Missing requried fields.'})
      }
      let user = await User.findOne({_id:userId});
      if(user){
        user.username=username;
        await User.findOneAndUpdate({_id:userId},user)
        return res.status(200).json({
          message: "user updated successfully.",
        });
      }else{
        res.status(400).json({
          message: "user not found.",
        });
      }
      
    } catch (error) {
      console.log('errir while udpating user',error);
      return res.status(500).json({message:'Server error.'})
      
    }
  }),

  getAllUsers:expressAsyncHandler(async(req,res)=>{
    let userQuery = req.query.search?{
      $or:[
       {'username':{$regex:req.query.search,$options:'i'}},
      ]
    }:{};
    const user = await User.find(userQuery).find({_id:{$ne:req.query.user_id}});
     return res.status(200).json({
      user
    })
  })
};