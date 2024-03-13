import {createError} from '../error.js'
import User from '../model/user.model.js'
import Video from '../model/video.model.js'

export const updateUser = async(req,res,next)=>{
    if (req.params.id === req.user.id) {
        
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{new:true})

            res
            .status(200)
            .json(updatedUser)
        } 
        catch (error) {
            next(error)
        }

    } 
    else {
        next(createError(400,"You can update only your account"))
    }
}

export const deleteUser = async(req,res,next)=>{
    if (req.params.id === req.user.id) {
        
        try {
            await User.findByIdAndDelete(req.params.id)

            res
            .status(200)
            .json("User has been deleted")
        } 
        catch (error) {
            next(error)
        }

    } 
    else {
        next(createError(400,"You can delete only your account"))
    }

}

export const getUser = async(req,res,next)=>{
    if (req.params.id ) {
        
        try {
            const user = await User.findByIdAndUpdate(req.params.id)

            res
            .status(200)
            .json(user)
        } 
        catch (error) {
            next(error)
        }

    } 
    else {
        next(createError(400,"You can update only your account"))
    }

}

export const subscribeUser = async(req,res,next)=>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $push : {subscribedUsers: req.params.id}
        });

        await User.findByIdAndUpdate(req.params.id,{
            $inc : {subscribers: 1}
        });

        res
        .status(200)
        .json("Subscription successful")
    } 
    catch (error) {
        next(error)
    }
}

export const unsubscribeUser = async(req,res,next)=>{
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull : {subscribedUsers: req.params.id}
        });

        await User.findByIdAndUpdate(req.params.id,{
            $inc : {subscribers: -1}
        });

        res
        .status(200)
        .json("Unsubscription successful")
    } 
    catch (error) {
        next(error)
    }
}

export const likeVideo = async(req,res,next)=>{
    const videoId = req.params.videoId
    const id = req.user.id
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id}
        })
        res
        .status(200)
        .json("The video has been liked")
    } 
    catch (error) {
        
    }

}

export const dislikeVideo = async(req,res,next)=>{
    const videoId = req.params.videoId
    const id = req.user.id
    try {
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id}
        })
        res
        .status(200)
        .json("The video has been disliked")
    } 
    catch (error) {
        
    }
}
