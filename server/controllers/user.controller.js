import {createError} from '../error.js'
import User from '../model/user.model.js'
import Video from '../model/video.model.js'
import View from '../model/view.model.js'
import Comment from '../model/comment.model.js'

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

export const deleteUser = async (req, res, next) => {
    const userId = req.user.id;

    try {
        // Check if the user is trying to delete their own account
        if (userId !== req.user.id) {
            return next(createError(400, "You can delete only your account"));
        }

        //Deleting comment associated with user
        Comment.deleteMany({userId})

        // Fetch all videos associated with the user
        const videos = await Video.find({ userId: userId });

        // Delete all comments and views associated with each video
        (videos.map(async (video) => {
            await Comment.deleteMany({ videoId: video._id });
            await View.deleteMany({ videoId: video._id });
        }));

        // Delete all videos associated with the user
        await Video.deleteMany({ userId: userId });

        // Delete the user
        await User.findByIdAndDelete(req.user.id);

        res.status(200).json("User, associated videos, and comments have been deleted");
    } catch (error) {
        next(error);
    }
};


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

export const avatarAdd = async (req, res) => {
    console.log("I am in addAvatar");
    const userId = req.user.id;
    const { imageFileUrl } = req.body;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { img: imageFileUrl },
            { new: true } // This option returns the updated document
        );

        await User.save();
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAvatar = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { img: '' },
            { new: true } // This option returns the updated document
        );

        await User.save();
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};