import { createError } from '../error.js'
import Comment from '../model/comment.model.js'
import Video from '../model/video.model.js'


export const addComment = async(req,res,next)=>{
    const newComment = new Comment({...req.body, userId:req.user.id})
    try {
        const savedComment = await newComment.save()

        res
        .status(200)
        .json(savedComment)
    }
    catch (error) {
        next(error)
    }
}

export const deleteComment = async(req,res,next)=>{
    try {
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)
        
        if(req.user.id === comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id)

            res
            .status(200)
            .json("The comment has been deleted")
        }else{
            return next(createError(403,"You can delete only those comments which you own"))
        }
    }
    catch (error) {
        next(error)
    }
}

export const getComments = async(req,res,next)=>{
    try {
        const comments = await Comment.find({videoId: req.params.videoId})
        res
        .status(200)
        .json(comments)

    }
    catch (error) {
        next(error)
    }
}
export const editComment = async(req,res,next)=>{
    try {
        const commentId = req.params.id;
        const { desc } = req.body;

        // Find the comment by ID
        const comment = await Comment.findById(commentId);

        // Check if the comment exists
        if (!comment) {
            return res
            .status(404)
            .json({ message: 'Comment not found' });
        }

        // Check if the user is the author of the comment
        if (comment.userId !== req.user.id) {
            return res
            .status(403)
            .json({ message: 'You can only update your comment' });
        }

        // Update the comment with the new description
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { desc },
            { new: true } // Return the updated document
        );

        res
        .status(200)
        .json(updatedComment);
    } catch (error) {
        next(error);
    }
}