const mongoose = require ('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost/group_chat',{
          useNewUrlParser :true,
          useUnifiedTopology:true
        });
        console.log('mongodb connected.' + conn.connection.host)
        
    } catch (error) {
        console.log(error.message);
        process.exit()
    }
};

module.exports = connectDb;