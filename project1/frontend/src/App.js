
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import NavBar from './pages/NavBar'
import AddWorkout from './pages/AddWorkout';
import Login from './pages/login';
import Singup from './pages/Singup';
import { useAuthContext } from './hooks/authcontexthook';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './hooks/ProtectedRoute'


function App() {
  const { user } = useAuthContext()

  return (
    <>
      <div >
        <BrowserRouter>

          <header >

            <NavBar />
          </header>
          <div className='Pages'>
            <Routes>

              <Route path="/verify/:token" element={<VerifyEmail />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <AddWorkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />

              <Route
                path="/signup"
                element={!user ? <Singup /> : <Navigate to="/" />}
              />

            </Routes>
          </div>

        </BrowserRouter>

      </div>
    </>
  );
}

export default App;
