const expressAsyncHandler = require("express-async-handler");
const User = require("../model/user");
const Group = require('../model/group');
const { default: mongoose } = require("mongoose");


module.exports={

    createGroup : expressAsyncHandler(async (req, res) => {
        const { groupName,userId } = req.body;
        if(!groupName || !userId){
            return res.status(404).json({message:'Missing required fields.'})
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'Invalid userId format.' });
        }
        const user = await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({message:'User not found.'})
        }
        try {
            let group = await Group.create({name:groupName,members:[userId],created_by:userId})
            res.status(200).json({ message: 'Group created successfully', group });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }),

    addUserToGroup:expressAsyncHandler(async(req,res)=>{
       try {
        const {groupId,userId} = req.body;
        if(!groupId || !userId){
            return res.status(404).json({message:'Missing required fields.'})
        }
        let group = Group.findOne({_id:groupId});
        let user = await User.findOne({_id:userId})
        if(!user){
            res.status(400).json({message:'User not found.'})
        }
        if(group){
            if(group.members.lengnth>0 && group.members.includes(userId)){
                //if user already added to group
                return res.status(200).json({ message: 'User is already added to group'});
            }else{
                group.members.push(userId);
                await Group.findOneAndUpdate({_id:group._id},group);
                res.status(200).json({ message: 'User added to group successfully.'});
            }
        }else{
            res.status(400).json({ message: 'Group not found'});
        }
       } catch (error) {
            console
            res.status(500).send('Server Error');
       }
    }),

    deleteGroup :expressAsyncHandler (async (req, res) => {
        const { groupId,userId } = req.params;
    
        try {
            // Check if group exists
            let group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found.' });
            }
            if(group && group.created_by !== userId){
                return res.status(404).json({message:'You are not authorized to delete this group.'})
            }
    
            // Delete group
            await Group.findByIdAndDelete(groupId);
    
            res.status(200).json({ message: 'Group deleted successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }),

    sendMessage: expressAsyncHandler(async (req,res)=>{
        try {
            let {message,senderId,groupId} = req.body;
            let group = await Group.findOne({_id:groupId});
            let sender = await User.findOne({_id:senderId});
            if(!sender){
                return res.status(404).json({ message: 'user not found.' });
            }
            if(!group){
                return res.status(404).json({ message: 'Group not found.' });
            }else{
                let textDetail ={
                    text:message,
                    sender:senderId,
                    likes:[]
                }
            console.log('message',textDetail)

                group.messages.push(textDetail);
                let groupMessage = await Group.findOneAndUpdate({_id:groupId},group,{ new: true });
                return res.status(200).json({ message: 'message sent.',groupMessage });
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            return res.status(500).json({ message: 'Server error.' });
        }
    }),

    likeMessage: expressAsyncHandler(async(req,res)=>{
        try {
            let {groupId,messageId,userId} = req.body;
            if(!groupId || !messageId || !userId){
                return res.status(404).json({message:'Missing required fields.'})
            }
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(404).json({ message: 'Invalid userId format.' });
            }
            if (!mongoose.Types.ObjectId.isValid(messageId)) {
                return res.status(404).json({ message: 'Invalid messageId format.' });
            }
            if (!mongoose.Types.ObjectId.isValid(groupId)) {
                return res.status(404).json({ message: 'Invalid groupId format.' });
            }
            let group = await Group.findOne({_id:groupId});
            let user = await User.findOne({_id:userId});
            if(!user){
                return res.status(404).json({message:'Invalid user id.'})
            }
            if(!group){
                return res.status(404).json({message:'Group not found.'})
            }

            // Find the message in the group's messages array
            let messageIndex = group.messages.findIndex(msg => msg._id.toString() === messageId);

            // Check if message exists in the group
            if (messageIndex === -1) {
                return res.status(400).json({ message: 'Message not found in the group.' });
            }

            // Check if the user has already liked the message
            if (group.messages[messageIndex].likes.includes(userId)) {
                return res.status(400).json({ message: 'You have already liked this message.' });
            }

            // Add userId to the likes array of the message
            group.messages[messageIndex].likes.push(userId);

            // Save the updated group
            await group.save();

            // Optionally, fetch the updated group after saving
            let updatedGroup = await Group.findOne({ _id: groupId });

            return res.status(200).json({ message: 'Message liked successfully.',updatedGroup });

            
        } catch (error) {
            console.log('errr',error);
            return res.status(500).json({message:'Server Error.'})
            
        }
    })


    

}