import express from 'express'
import 
    { 
        updateUser,
        deleteUser, 
        getUser, 
        subscribeUser, 
        unsubscribeUser,
        likeVideo,
        dislikeVideo,
        avatarAdd,
        deleteAvatar
    } 
    from '../controllers/user.controller.js';

import { verifyToken } from '../verifyToken.js';


const router = express.Router();




//update a user
router.put('/update/:id',verifyToken, updateUser)

//delete a user
router.delete('/:id',verifyToken, deleteUser)

//get a user
router.get('/find/:id',getUser)

//subscribe a user
router.put('/sub/:id',verifyToken, subscribeUser)

//unsubscribe a user
router.put('/unsub/:id',verifyToken, unsubscribeUser)

//like a video
router.put('/like/:videoId',verifyToken, likeVideo)

//unlike a video
router.put('/dislike/:videoId',verifyToken, dislikeVideo)

router.patch('/avatar',verifyToken,avatarAdd)
router.patch('/avatar/delete',verifyToken,deleteAvatar)


export default router;