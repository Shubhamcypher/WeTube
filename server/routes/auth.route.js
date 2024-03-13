import express from 'express'
import { googleAuth, signin, signup } from '../controllers/auth.controller.js';


const router = express.Router();



//CREATE a user
router.post('/signup',signup)

//Sign in a user
router.post('/signin', signin)


//Google auth
router.post('/googleAuth',googleAuth)


export default router;