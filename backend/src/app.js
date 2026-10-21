require('dotenv').config()
const express=require('express');
const morgan = require("morgan");
const connectDB=require('./config/db.js');
const errorHandler=require('./middleware/errorHandler.js');
const router=require('./routes/index.js');
const Redis = require('./config/redis.js')
const app=express()

const PORT=process.env.PORT || 3000
connectDB();

app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api',router);
app.use('/',errorHandler);






app.listen(PORT,()=>{
    console.log(`your server is up and running at port:${PORT}`)
})