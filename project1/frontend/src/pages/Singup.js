import React, { useState } from "react";
import './Home'
import { useSignup } from "../hooks/useSinguphook";

const Singup = () => {
  const { signup, loading,error,message}=useSignup()
  const [email, setEmail]= useState('')
  const [password, setPassword]=useState('')

const handleSubmit=async(e)=>{
  e.preventDefault()
  await signup(email,password)
   setEmail('')
   setPassword('')
  
}
  return (
    
    <div className="login-container">
     
      <h2>Singup</h2>
{message && <div className="success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" onChange={(e)=>setEmail(e.target.value)} value={email} placeholder="Enter your email" required />
        </div>

        <div>
          <label>Password</label>
          <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password} placeholder="Enter your password" required />
        </div>

        <button type="submit" disabled={loading}>Singup</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Singup;