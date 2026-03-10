import { useState } from "react"
import { useAuthContext } from "./authcontexthook"

export const useSignup = () => {

const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)
const [message, setMessage] = useState(null)

const { dispatch } = useAuthContext()

const signup = async (email,password) => {

setLoading(true)
setError(null)
setMessage(null)

const response = await fetch('/api/user/signup',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify({email,password})
})

const json = await response.json()

if(!response.ok){
  setLoading(false)
  setError(json.error)
}

if(response.ok){

// ❌ DO NOT LOGIN USER HERE
// localStorage.setItem('user', JSON.stringify(json))
// dispatch({type:'LOGIN', payload:json})

setMessage("Signup successful. Please check your email to verify your account.")

setLoading(false)

}

}

return {signup,loading,error,message}

}