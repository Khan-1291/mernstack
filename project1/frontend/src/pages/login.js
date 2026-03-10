import React, { useState } from "react";
import './Singup.css'
import { useLogin } from "../hooks/useSigninhook";
//import { AuthContext } from "../workoutContext/authcontext";


const Login= () => {
  //const {dispatch}= AuthContext()
  const [email, setEmail]= useState('')
  const [password, setPassword]=useState('')
  const {login,loading,error}= useLogin()
  

const handleSubmit=async(e)=>{
  e.preventDefault()

  
  await login(email,password)

}
  return (
    
    <div className="login-container">
     
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email"  onChange={(e)=>setEmail(e.target.value)}  value={email} placeholder="Enter your email" required />
        </div>

        <div>
          <label>Password</label>
          <input type="password"  onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Enter your password" required />
        </div>

        <button type="submit">Login</button>
        {error &&<div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;