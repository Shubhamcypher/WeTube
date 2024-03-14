import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config();

import userRoutes from './routes/user.route.js'
import videoRoutes from './routes/video.route.js'
import commentRoutes from './routes/comment.route.js'
import authRoutes from './routes/auth.route.js'


const app = express()

const connect = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connection successful");
    }).catch((err)=>{
        throw err;
    })
}

app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin: '*',
    credentials: true, // This is needed if you're using cookies or authentication
}));


//appending routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/video',videoRoutes)
app.use('/api/comment',commentRoutes)

//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  });
  


app.listen(process.env.PORT,()=>{
    connect();
    console.log(`Server is running on port 8000 `);
})