import express from 'express'
import { googleAuth, logout, signin, signup } from '../controllers/auth.controller.js';
import { refreshAccessToken } from '../controllers/refreshToken.controller.js';
import { verifyToken } from '../verifyToken.js';


const router = express.Router();



//CREATE a user
router.post('/signup',signup)

//Sign in a user
router.post('/signin', signin)


//Google auth
router.post('/googleAuth',googleAuth)

//logout
router.get('/logout',verifyToken,logout)

router.post('/refresh-token', refreshAccessToken);


export default router;