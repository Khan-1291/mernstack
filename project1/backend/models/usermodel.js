const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const Schema = mongoose.Schema

const userSchema = new Schema({

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  isVerified:{
    type:Boolean,
    default:false
  },

  verificationToken:{
    type:String
  }

},{timestamps:true})


// LOGIN
userSchema.statics.login = async function(email,password){

if(!email || !password){
  throw Error("All fields must be filled")
}

const user = await this.findOne({email})

if(!user){
  throw Error("No user found with this email")
}

if(!user.isVerified){
  throw Error("Please verify your email first")
}

const match = await bcrypt.compare(password,user.password)

if(!match){
  throw Error("Password is incorrect")
}

return user

}


// SIGNUP
userSchema.statics.signup = async function(email,password){

if(!email || !password){
  throw Error("All fields must be filled")
}

if(!validator.isEmail(email)){
  throw Error("Enter a valid email address")
}

if(!validator.isStrongPassword(password)){
  throw Error("Password must be strong")
}

const exist = await this.findOne({email})

if(exist){
  throw Error("User already exists")
}

const salt = await bcrypt.genSalt(10)
const hash = await bcrypt.hash(password,salt)

const verificationToken = crypto.randomBytes(32).toString("hex")

const user = await this.create({
  email,
  password:hash,
  verificationToken
})

return user

}

module.exports = mongoose.model('User',userSchema)