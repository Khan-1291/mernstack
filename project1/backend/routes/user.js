const express =require('express')
const router=express.Router()
const {signupUser,loginUser, verifyEmail}=require('../controlers/userController')


router.get("/verify/:token", verifyEmail)


router.post('/login',loginUser)


router.post('/signup',signupUser)




module.exports=router