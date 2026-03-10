import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const VerifyEmail = () => {

  const { token } = useParams()
  const navigate = useNavigate()

  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {

    const verifyUser = async () => {

      try {

        const response = await fetch(`http://localhost:3000/api/user/verify/${token}`)
        const data = await response.json()

        if (response.ok) {

          setMessage(data.message)

          setTimeout(() => {
            navigate("/login")
          }, 2000)

        } else {

          if (data.error === "Token invalid or already used") {
            setMessage("Email  verified. Redirecting to login...")
          } else {
            setMessage(data.error)
          }

          setTimeout(() => {
            navigate("/login")
          }, 2000)

        }

      } catch (error) {

        setMessage("Cannot connect to server")

      }

    }

    verifyUser()

  }, [token, navigate])

  return (
    <div style={{textAlign:"center",marginTop:"100px"}}>
      <h2>{message}</h2>
    </div>
  )
}

export default VerifyEmail