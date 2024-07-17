const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true, unique: true,trim:true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{
        text: { type: String, required: true,trim:true },
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    }],
    created_by:{type:String,trim:true}
});

module.exports = mongoose.model('Group', groupSchema);