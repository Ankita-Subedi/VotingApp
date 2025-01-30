import { Link } from "react-router-dom"

const ButtonS = ({label, path}) => {
  return (
    <div className=" bg-green-600 inline-block px-4 py-1 rounded-lg text-white">
      <Link to={path}>
      {label}
      </Link>
    </div>
  )
}

export default ButtonS
