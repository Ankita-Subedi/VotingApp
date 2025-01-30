import AuthForm from "../components/AuthForm"

const Login = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <AuthForm title="Login" btnTxt="Login"/>
    </div>
  )
}

export default Login