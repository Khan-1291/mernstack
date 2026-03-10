
const express= require("express")
const Workout= require('../models/workoutmodel')
const router= express.Router()

const {createworkout,getWorkouts,getWorkout, deleteWorkout,updateWorkout}=require('../controlers/workoutcontroler')
const requireAuth =require ('../middleware/requestAuth')






router.use(requireAuth)
router.get('/',requireAuth,getWorkouts)
router.get('/:id',requireAuth,getWorkout)

/*router.get('/',(req,res)=>{
   
    res.json({mes:"All workouts are fetched"})

})
router.get('/:id',(req,res)=>{
    res.json({MES:"requested workout is their"})
})

/*router.post('/',async (req,res)=>{
  const {title,reps,load}= req.body
    try {
        const workout= await Workout.create({title,reps,load})
        res.status(200).json(workout)
    } catch (error) {
        console.log(error)
    }
    res.json({mesg:"Workout posted"})

})*/

router.post('/', requireAuth,createworkout)


router.delete('/:id',requireAuth,deleteWorkout)


router.patch('/:id',requireAuth, updateWorkout)



module.exports=router