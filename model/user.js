const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: { type: String, required: true,trim:true },
    password: { type: String, required: true,trim:true },
    isAdmin: { type: Boolean, default: false },
});
userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('User', userSchema);