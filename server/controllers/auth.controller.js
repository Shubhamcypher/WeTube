import mongoose from 'mongoose'
import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { createError } from '../error.js';
import jwt from 'jsonwebtoken'



const options = {
    httpOnly: true,
    secure: true
}

export const signup = async (req, res, next)=>{
    const salt =  bcrypt.genSaltSync(10);
    const hash =  bcrypt.hashSync(req.body.password, salt);

    try {
        const newUser =  new User({...req.body,password:hash})
        await newUser.save()

        res
        .status(200)
        .json("User added successfully!!!!")
    } 
    catch (error) {
        next(error)
    }
}

export const signin = async (req,res,next)=>{

    try {

        const user = await User.findOne({name:req.body.name})
        if(!user) return next(createError(404,"No user found"))

        const isPasswordCorrect =  bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) return next(createError(400,"Invalid user credentials"));


        //injecting payload , which is here in this case is _id of user stored in MongoDB
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY )
        

        const {password, ...userDetails} = user._doc


        //if you want to verify cookie in postman you can check there and also in browser developer tools
        res
        .cookie("access_token",token,options)
        .status(200)
        .json(token)

        

    } 
    catch (error) {
        next(error)
    }
}

export const googleAuth = async (req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY )
            console.log(token);
            res
            .cookie("access_token",token,options)
            .status(200)
            .json(user._doc)
        }
        else{
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = newUser.save();
            const token = jwt.sign({id:savedUser._id},process.env.JWT_SECRET_KEY )
            res
            .cookie("access_token",token,options)
            .status(200)
            .json(savedUser._doc)
        }
    } 
    catch (error) {
        next(error)
    }
}
