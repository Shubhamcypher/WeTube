import  jwt  from "jsonwebtoken";
import {createError} from './error.js'


export const verifyToken = (req,res,next)=>{

    const token = req.cookies.access_token;
    if(!token) return next(createError(400,"You are not authenticated!"))
    

    //here we are checking if the token matches, if not matches it will have error and the if condition follows if no erros req.user ko database wale user ka access mil jyga
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user)=>{
        if(err) return next(createError(400,"Token verification failed!!"));

        req.user = user;
        next();
    })
}