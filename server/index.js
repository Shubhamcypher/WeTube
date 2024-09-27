import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'build')));


app.use(cors({
  origin: ['https://we-tube-mu.vercel.app', 'https://server-rwug.onrender.com', 'http://localhost:5174', 'http://localhost:8000/', 'https://nominatim.openstreetmap.org', 'http://192.168.57.110:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Explicitly allow OPTIONS method
  credentials: true,  // Allows cookies or authentication to be sent
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers like Authorization
}));


app.options('*', cors({
  origin: ['https://we-tube-mu.vercel.app', 'https://server-rwug.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));




//appending routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/video',videoRoutes)
app.use('/api/comment',commentRoutes)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });



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
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log(`Time is ${new Date(Date.now() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000)).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} `);
})