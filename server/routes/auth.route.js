import express from 'express';
import { google, signin, signout, signup, adminSignin } from '../controllers/auth.controller.js';



const router = express.Router();

router.post("/signup",signup)
router.post('/signin',signin)
router.post('/admin/signin',adminSignin)

router.post('/google',google)
router.get('/signout',signout)
router.post('/signout',signout) // Add POST method for signout

export default router;