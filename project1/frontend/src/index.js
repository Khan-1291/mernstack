import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import WorkoutContextprovider from '../src/workoutContext/workoutcontext'
import { AuthContextProvider } from './workoutContext/authcontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutContextprovider>
        <App />
      </WorkoutContextprovider>
    </AuthContextProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

