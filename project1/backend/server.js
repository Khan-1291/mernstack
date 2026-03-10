const express= require("express")
const mongoose= require('mongoose')

require('dotenv').config()

const workoutRoutes= require('./routes/workouts')
const userRoutes= require('./routes/user')

const app= express()
app.use(express.json())
app.use((req,res,next) =>{
      
  console.log(req.path)
  console.log(req.method)

    next()
})

app.use('/api/workouts', workoutRoutes)
app.use('/api/user',userRoutes)
 
mongoose.connect(process.env.MONGO_URL).
then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is listining on port" + process.env.PORT)
    })

}).
catch(
    (error) =>{
console.log(error)
    }
)


/*app.listen(process.env.PORT ,()=>{
    console.log("app is lisstining on prt no"+  process.env.PORT)
})  */