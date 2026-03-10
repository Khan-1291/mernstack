const mongoose= require('mongoose')
const User = require('../models/usermodel')

const jwt= require('jsonwebtoken')

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
 service:"gmail",
 auth:{
   user:process.env.EMAIL,
   pass:process.env.EMAIL_PASS
 }
})

const sendVerificationEmail = async (email,token)=>{

 const url = `http://localhost:3000/verify/${token}`

 await transporter.sendMail({
   to:email,
   subject:"Verify your email",
   html:`Click here to verify: <a href="${url}">${url}</a>`
 })

}

const  createToken=(_id)=>{

   return jwt.sign({_id},process.env.JWTSECRET, {expiresIn:'3d'})

}
const loginUser=async(req,res)=>{
   const {email,password}=req.body
   try {

      const user= await User.login(email,password)
      const token= createToken(user._id)
      res.status(200).json({email,token})

      
   } catch (error) {
      res.status(400).json({"error":error.message})
   }


}



const signupUser= async(req,res)=>{
 const {email,password}= req.body

 try {
    const user= await User.signup(email,password)
    const token= createToken(user._id)
    sendVerificationEmail(email, user.verificationToken)

    res.status(200).json({email,token})
    
 } catch (error) {
    res.status(400).json({error:error.message})
 }
  



}

const verifyEmail = async (req, res) => {
  const { token } = req.params

  try {

    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res.status(400).json({
        error: "Token invalid or already used"
      })
    }

    user.isVerified = true
    user.verificationToken = null

    await user.save()

    return res.status(200).json({
      message: "Email verified successfully"
    })

  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}



module.exports={
    signupUser,
    loginUser,
    verifyEmail

}