import React from "react";
import "./Home.css";
import { useEffect } from "react";
import { useWorkoutContext } from "../hooks/useworkoucontext";
import { useAuthContext } from "../hooks/authcontexthook";


import formatDistanceToNow from "date-fns/formatDistanceToNow"



const Home = () => {
  const { workouts, dispatch } = useWorkoutContext()
  const {user}= useAuthContext()

  useEffect(() => {

    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts',{
        headers:{'Authorization':`Bearer ${user.token}`}
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_WORKOUTS', payload: json })
      }
    }
    if (user){
    fetchWorkouts()
    }
  }, [dispatch,user])

  const deleteWorkout = async (workout) => {

  const response = await fetch('/api/workouts/' + workout._id, {
      headers:{'Authorization':`Bearer ${user.token}`},
    method: 'DELETE'
  })

  const json = await response.json()

  if (response.ok) {
    dispatch({
      type: 'DELETE_WORKOUT',
      payload: json
    })
  }







  }

  return (
    <div className="home">
      <h1 className="home-title">Workout Dashboard</h1>

      <div className="workout-container">

        {workouts && workouts.map((workout) => (

          <div key={workout._id} className="workout-card">

            <h2>{workout.title}</h2>
            <p><strong>Reps:</strong> {workout.reps}</p>
            <p><strong>Load:</strong> {workout.load}</p>

<p>
{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
</p>          
      


            <button className="delete-btn" onClick={()=>deleteWorkout(workout)}>Delete</button>

          </div>

        ))}

      </div>
    </div>
  )
}

export default Home