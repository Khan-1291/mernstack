import { useContext } from "react"
import { WorkoutContext } from "../workoutContext/workoutcontext"

export const useWorkoutContext = () => {
   return useContext(WorkoutContext)
}