import { useContext} from "react";

import { useAuthContext } from "./authcontexthook";
import { useWorkoutContext } from "./useworkoucontext";

export const useLogout=()=>{
    const {dispatch:clearWorkouts}=useWorkoutContext()
    const {dispatch}= useAuthContext()


    const logout= ()=>{
localStorage.removeItem('user')

dispatch({type:'LOGOUT'})
clearWorkouts({type:'SET_WORKOUTS',payload:null})
console.log("user logout successfully")

    }
return{logout}
}