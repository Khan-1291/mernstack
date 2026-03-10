import { useState } from 'react'
import './Home.css'
import { useWorkoutContext } from "../hooks/useworkoucontext";
import { useAuthContext } from '../hooks/authcontexthook';

const AddWorkout =()=>{
  const {dispatch}=useWorkoutContext()
  const [title,setTitle]=useState('')
  const [reps, setReps]=useState('')
  const [load,setLoad]=useState('')
  const {user}= useAuthContext()

  const [error,seterror]=useState(null)
  const handleSubmit = async (e) => {
  e.preventDefault()

  if(!user){
    seterror("You must be logged in")
    return
  }

  const workout = { title, reps, load }

  const response = await fetch('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(workout),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    }
  })

  const json = await response.json()

  if (!response.ok) {
    seterror(json.error)
  }

  if (response.ok) {
    seterror(null)

    dispatch({
      type: 'CREATE_WORKOUT',
      payload: json
    })

    setTitle('')
    setReps('')
    setLoad('')
  }
}
  

return(
    <>
    <div className="form-section">
      <form onSubmit={handleSubmit}>
        <h2>Add New Workout</h2>
        <input type="text" onChange={(e)=>setTitle(e.target.value)}  value={title}   placeholder="Workout Title" />
        <input type="number" onChange={(e)=>setReps(e.target.value)} value={reps}  placeholder="Reps" />
        <input type="number"  onChange={(e)=>setLoad(e.target.value)} value={load} placeholder="Load (kg)" />
        <button className="add-btn" >Add Workout</button> 
        {error&& <div>{error}</div>}

     </form>
      </div>
    
    </>
)


}

export default AddWorkout