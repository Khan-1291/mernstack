// ProtectedRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuthContext } from "../hooks/authcontexthook"

const ProtectedRoute = ({ children }) => {
  const { user, authIsReady } = useAuthContext()

  if (!authIsReady) return <div>Loading...</div> // wait until context is ready

  return user ? children : <Navigate to="/login" />
}

export default ProtectedRoute