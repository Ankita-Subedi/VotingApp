import { Link } from "react-router-dom"
import ButtonS from "../components/ButtonS"

const Welcome = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="text-center">
      <h1 className="text-3xl">Welcome to Online Voting</h1>
      <p className="text-xl">Vote your favourite candidate!</p>
      <div className="mt-1">

      <ButtonS label="Login" path="login"/>
      </div>
      <p className="text-sm mt-1">New User? <span><Link className="border-b text-blue-600" to="/signup">Sign Up</Link></span></p>
      </div>
    </div>
  )
}

export default Welcome