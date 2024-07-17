const express = require('express');
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
const userRoutes = require('./route/user');
const groupRoute = require('./route/group');
const authRoute = require('./route/auth');
const dotEnv = require('dotenv');
const app = express();
const PORT = 5000;
dotEnv.config();
// Middleware
app.use(bodyParser.json());
//connection for database
connectDb();

//Routes
app.use('/api/user',userRoutes)
app.use('/api/group',groupRoute)
app.use('/api/auth',authRoute)


//running local server
app.listen(PORT,()=>{
    console.log(`port runnig on ${PORT}`)
});