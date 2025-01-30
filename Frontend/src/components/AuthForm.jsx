import { useState } from "react";
import ButtonS from "./ButtonS";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object({
  govid: Yup.string()
    .required("Gov id is required")
    .length(10, "Gov id must be exactly 10 characters"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password should be atleast 6 characters"),
});

const AuthForm = ({ title, btnTxt }) => {
  const [govid, setGovid] = useState("");
  const [password, setPassword] = useState("");
  const [govidError, setGovidError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGovidChange = (e) => {
    setGovid(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Gov ID: ", govid, "Password: ", password);
    setGovidError("");
    setPasswordError("");
    setErrorMessage("");

    try {
      await validationSchema.validate(
        { govid, password },
        { abortEarly: false }
      );

      const response = await axios.post("http://localhost:3000/login", {
        citizenshipNum: govid,
        password: password,
      });
      console.log("Login Sucess: ", response.data);
    } catch (err) {
      if (err.response) {
        // If the error is from the backend (e.g., invalid credentials)
        setErrorMessage(err.response.data.error);
      }

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path === "govid") {
            setGovidError(error.message);
          }
          if (error.path === "password") {
            setPasswordError(error.message);
          }
        });
      }
    }
  };

  return (
    <div className="border p-8 rounded-xl">
      <p className="text-2xl text-center my-6">{title}</p>
      <form onSubmit={handleSubmit} action="">
        <div className="flex flex-col gap-2">
          {/* Gov ID Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="govid">Gov ID:</label>
            <input
              className="border rounded p-1"
              type="number"
              placeholder="Gov ID"
              id="govid"
              value={govid}
              onChange={handleGovidChange}
            />
            {govidError && <p className="text-red-500"> {govidError} </p>}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              className="border rounded p-1"
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>

          {/* Button */}
          <div onClick={handleSubmit} className="text-center w-full">
            <ButtonS label={btnTxt} />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
