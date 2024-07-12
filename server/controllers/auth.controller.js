import mongoose from 'mongoose'
import User from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { createError } from '../error.js';
import jwt from 'jsonwebtoken'
import refreshTokenModel from '../model/refreshToken.model.js';



const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true if your frontend is served over HTTPS
    sameSite: 'None',
}

export const signup = async (req, res, next)=>{
    const salt =  await bcrypt.genSaltSync(10);
    const hash =  await bcrypt.hashSync(req.body.password, salt);

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

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "No user found"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Invalid user credentials"));

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Generate refresh token
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '2h' });

        // Store refresh token in database
        const newRefreshToken =  new refreshTokenModel({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 2 * 60* 60 * 1000) // 2 hours from login
        });
        await newRefreshToken.save();

        const { password, ...userDetails } = user._doc;

        res
            .cookie("access_token", accessToken, options)
            .cookie("refresh_token", refreshToken, options)
            .status(200)
            .json({ ...userDetails,  });

    } catch (error) {
        next(error);
    }
};

export const googleAuth = async (req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {

            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            // Generate refresh token
            const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '2h' });
    
            // Store refresh token in database
            const newRefreshToken =  new refreshTokenModel({
                userId: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
            });
            await newRefreshToken.save();

            res
            .cookie("access_token",accessToken,options)
            .cookie("refresh_token", refreshToken, options)
            .status(200)
            .json(user._doc)
        }
        else{
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save();

            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            // Generate refresh token
            const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '2h' });
    
            // Store refresh token in database
            const newRefreshToken =  new refreshTokenModel({
                userId: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
            });
            await newRefreshToken.save();

            
            res
            .cookie("access_token",accessToken,options)
            .cookie("refresh_token", refreshToken, options)
            .status(200)
            .json(savedUser._doc)
        }
    } 
    catch (error) {
        next(error)
    }
}


export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) return next(createError(400, "No refresh token found"));

        // Delete the refresh token from the database
        await refreshTokenModel.findOneAndDelete({ token: refreshToken });
        console.log("Refresh token deleted from the database");

        // Clear cookies
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });
        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
};



