import { useState } from "react";
import ButtonS from "../components/ButtonS";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  govid: Yup.string()
    .required("Gov ID is required")
    .length(10, "Gov ID must be exactly 10 characters")
    .test(
      "length",
      "Gov ID must be exactly 10 characters",
      (value) => !value || value.length === 10
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();

  // Form States
  const [govid, setGovid] = useState("");
  const [password, setPassword] = useState("");

  // Error States
  const [govidError, setGovidError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Generic Input Handler
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form...");

    // Reset errors
    setGovidError("");
    setPasswordError("");
    setErrorMessage("");

    try {
      // Prepare data for validation
      const validationData = { govid, password };

      // Validate input fields using Yup
      await validationSchema.validate(validationData, { abortEarly: false });

      const userData = { citizenshipNum: govid, password };

      console.log("Sending Data: ", userData);

      const response = await axios.post(
        "http://localhost:3000/user/login",
        userData
      );
      console.log("Success: ", response.data);

      // Store token after successful login
      localStorage.setItem("authToken", response.data.token);

      // Navigate to home page after successful login
      navigate("/home");
    } catch (err) {
      console.error("Caught error:", err);
      if (err instanceof Yup.ValidationError) {
        console.log("Validation Errors:", err.inner);
        // Manually set errors for each field
        err.inner.forEach((error) => {
          if (error.path === "govid") setGovidError(error.message);
          if (error.path === "password") setPasswordError(error.message);
        });
        return; // Stop execution if validation fails
      }
      if (err.response) {
        console.log("Error:", err.response.data);
        setErrorMessage(
          err.response.data.error || "Login failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-3.5">
      <div className="border p-8 rounded-xl w-full max-w-lg">
        <p className="text-2xl text-center my-6">Login</p>
        <form>
          <div className="flex flex-col gap-2">
            {/* Gov ID Input */}
            <div className="flex flex-col gap-1">
              <label>Gov ID:</label>
              <input
                className="border rounded p-1"
                type="text"
                placeholder="Gov ID"
                value={govid}
                onChange={handleInputChange(setGovid)}
              />
              {govidError && <p className="text-red-500">{govidError}</p>}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <label>Password:</label>
              <input
                className="border rounded p-1"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleInputChange(setPassword)}
              />
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center w-full" onClick={handleSubmit}>
              <ButtonS label="Login" />
            </div>

            {/* Error message */}
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
