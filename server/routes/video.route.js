import express from 'express'
import { 
        addView,
        createVideo,
        deleteVideo, 
        getByTag, 
        getVideo,
        random, 
        search, 
        subscribed, 
        trending, 
        updateVideo
       } from '../controllers/video.controller.js';

import { verifyToken } from '../verifyToken.js';


const router = express.Router();

//create a video
router.post("/",verifyToken,createVideo)

//update a video
router.put("/update/:id",verifyToken,updateVideo)

//delete a video
router.delete("/:id",verifyToken,deleteVideo)

//get a video
router.get("/find/:id",getVideo)

//get views of video
router.put('/views/:id',verifyToken,addView)

//get trending video
router.get('/trending',trending)

//get random,video
router.get('/random',random)

//get subscribed video
router.get('/subscribed',verifyToken,subscribed)

//get searched video
router.get('/search',search)

//get video by tag
router.get('/tags',getByTag)

export default router;