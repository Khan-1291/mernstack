
const Workout= require('../models/workoutmodel')
const mongoose=require('mongoose')
//get workouts from db
const getWorkouts= async(req,res)=>{

    try {
        const workouts= await Workout.find({}).sort({createdAt:-1})
res.json(workouts)

    } catch (error) {
        console.log(error)
    }

}
// single workout


const getWorkout=async(req,res)=>{

    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.json({msg:"No such id exist"})
    }
    try {
        const workout= await Workout.findById(id)
        if (!workout){
            return res.json({msg:"No workout find with "})

        }
        
        res.json(workout)
    } catch (error) {
        console.log(error)
    }
}
// create db doucument
const createworkout= async(req,res)=>{
   
    const {title,reps,load}=req.body
    try {
        const workout= await Workout.create({title,reps,load})

        
        res.json(workout)
        
    } catch (error) {
        console.error(error)
    }


}
// dealteding db doucument

 const deleteWorkout= async (req,res)=>{

    const {id}= req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.json({msg:"NO SUCH ID EXIST"})
    }
    try {

     const workout= await Workout.findOneAndDelete({_id:id})
     if (!workout){
    return res.json({msg:"No workout find with "})

        }
    return res.json({msg: "Workout dealted"})   
  
    
        
    } catch (error) {
        console.log(error)
    }

 }


 // dealteding db doucument

 const updateWorkout= async (req,res)=>{

    const {id}= req.params
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.json({msg:"NO SUCH ID EXIST"})
    }
    try {

     const workout= await Workout.findOneAndUpdate({_id:id},{
        
        ...req.body
     })
     if (!workout){
    return res.json({msg:"No workout find with "})

        }
    return res.json({msg: "Workout dealted"})   
  
    
        
    } catch (error) {
        console.log(error)
    }

 }

module.exports= {
    createworkout,
    getWorkouts,
    getWorkout,
    deleteWorkout,
    updateWorkout
}