import { createError } from '../error.js'
import Video from '../model/video.model.js'
import User from '../model/user.model.js'
import View from '../model/view.model.js'
import Comment from '../model/comment.model.js'

export const createVideo = async(req,res,next)=>{

    const newVideo = new Video({userId:req.user.id, ...req.body})

    try {
        const savedVideo = await newVideo.save();
        res
        .status(200)
        .json(savedVideo)
    } 
    catch (error) {
        console.log(error);
        next(error)
    }
}
export const updateVideo = async(req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id)
        if(!video) return next(createError(404,"Video not found"))
        console.log(req.params.id);
        console.log(req.user.id);
        if (req.user.id) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{new:true});

        res
        .status(200)
        .json(updatedVideo)
        }
        else{
            return next(createError(403, "You can update only your video!"));
        }
        
    } 
    catch (error) {
        next(error)
    }
}
export const deleteVideo = async(req,res,next)=>{
    try {
        await Comment.deleteMany({videoId:req.params.id})
        await View.deleteMany({videoId:req.params.id})

        const video = await Video.findById(req.params.id)
        if(!video) return next(createError(404,"Video not found"))
        if (req.user.id) {
            const updatedVideo = await Video.findByIdAndDelete(req.params.id)

        res
        .status(200)
        .json("Video Deleted Successfully")
        }
        else{
            return next(createError(403, "You can delete only your video!"));
        }
    } 
    catch (error) {
        next(error)
    }
}

export const getVideo = async(req,res,next)=>{
    try {
        const video = await Video.findById(req.params.id)
        res
        .status(200)
        .json(video)
        
    } 
    catch (error) {
        next(error)
    }
}

export const addView = async(req,res,next)=>{
    
    try {
        const videoId = req.params.id;
        const userId  = req.user.id;
        

        // Check if the user has already viewed the video
        const existingView = await View.findOne({ userId, videoId });

        if (!existingView) {
            // If the user hasn't viewed the video, increment the view count
            await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } }, { new: true });

            // Record that the user has viewed the video
            await View.create({ userId, videoId });

            return res.status(200).json("The view has been increased");
        } else {
            // If the user has already viewed the video, return a message indicating that the view count was not incremented
            return res.status(200).json("The user has already viewed this video");
        }
    } catch (error) {
        next(error);
    }
}


export const random = async(req,res,next)=>{
    try {
        const videos = await Video.aggregate([{$sample:{size:40}}])
        res.
        status(200)
        .json(videos)
    } 
    catch (error) {
        next(error)
    }
}


export const trending = async(req,res,next)=>{
    try {
        const videos = await Video.find().sort({views:-1})
        res
        .status(200)
        .json(videos)
    } 
    catch (error) {
        next(error)
    }
}


export const subscribed = async(req,res,next)=>{
    try {
            const user = await User.findById(req.user.id);
            const subscribedChannels = user.subscribedUsers; //Retrieves the list of channel IDs that the user is subscribed to from the subscribedUsers field of the user document.
        
            const list = await Promise.all(
              subscribedChannels.map(async (channelId) => {
                return await Video.find({ userId: channelId });
              })
            );
        
            res
            .status(200)
            .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
          } 
    catch (error) {
        next(error)
    }
}


export const getByTag = async(req,res,next)=>{
    const tags = req.query.tags.split(",")
    try {
        const videos = await Video.find({tags: {$in:tags}}).limit(20);

        res
        .status(200)
        .json(videos)
    } 
    catch (error) {
        next(error) 
    }
}

export const search = async (req, res, next) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is missing' });
    }

    try {
        console.log("Search query:", query);

        const videos = await Video.aggregate([
            {
                $addFields: {
                    userIdObjectId: { $toObjectId: "$userId" }
                }
            },
            {
                $lookup: {
                    from: 'users', // Name of the user collection
                    localField: 'userIdObjectId', // Converted ObjectId field
                    foreignField: '_id', // Field from the user collection
                    as: 'user' // Alias for the joined user data
                }
            },
            {
                $unwind: '$user' // Deconstruct the user array
            },
            {
                $match: {
                    $or: [
                        { title: { $regex: new RegExp(query, 'i') } },
                        { tags: { $regex: new RegExp(query, 'i') } },
                        { 'user.name': { $regex: new RegExp(query, 'i') } } // Match against the user name
                    ]
                }
            },
            {
                $limit: 40
            }
        ]);

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No matching videos found' });
        }

        console.log("Matching videos:", videos);

        res.status(200).json(videos);
    } catch (error) {
        console.error("Error in search function:", error);
        next(error);
    }
}
