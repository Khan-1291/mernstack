import { AuthContext } from "../workoutContext/authcontext";
import { useContext } from "react";


export const useAuthContext=()=>{

    const context = useContext(AuthContext)
    if(!context){
        throw Error ("UseAuthContexte Inside workoutcontextprovide")
    }
    return context
}