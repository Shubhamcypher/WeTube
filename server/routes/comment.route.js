import express from 'express'
import { addComment, deleteComment, editComment, getComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../verifyToken.js';


const router = express.Router();

router.post('/',verifyToken,addComment)
router.delete('/:id',verifyToken,deleteComment)
router.get('/:videoId',verifyToken,getComments)
router.patch('/edit/:id',verifyToken,editComment)


export default router;