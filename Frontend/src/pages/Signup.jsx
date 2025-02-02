import { useState } from "react";
import ButtonS from "../components/ButtonS"
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),

  age: Yup.number()
    .test('required', 'Age is required', value => value !== undefined && value !== null && value !== '')
    .typeError("Age must be a number") // Error for non-numeric input
    .integer("Age must be a whole number")
    .min(18, "You must be at least 18 years old to vote")
    .max(120, "Please enter a valid age"),

  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .notRequired(),

  address: Yup.string().required("Address is required"),

  govid: Yup.string()
    .required("Gov ID is required")
    .length(10, "Gov ID must be exactly 10 characters")
    .test(
      "length",
      "Gov ID must be exactly 10 characters",
      (value) => !value || value.length === 10
    ), // display this error if this function fails

  password: Yup.string()
    .test('required', 'Password is required', value => value !== undefined && value !== null && value !== '')
    .min(6, "Password should be at least 6 characters"),
});

const Signup = () => {
  const navigate = useNavigate();

  // Form States
  const [govid, setGovid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  // Error States
  const [govidError, setGovidError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [mobileError, setMobileError] = useState("");
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
      const validationData = { govid, password, name, age, mobile, address };
      
      // Validate input fields using Yup
      await validationSchema.validate(validationData, { abortEarly: false });

      const userData = { citizenshipNum: govid, password, name, age, mobile, address };
      
      console.log("Sending Data: ", userData);

      const response = await axios.post("http://localhost:3000/user/signup", userData);
      console.log("Success: ", response.data);

      // Store token after successful signup
      localStorage.setItem("authToken", response.data.token);

      // Navigate to home page after successful signup
      navigate("/home");
    } catch (err) {
      console.error("Caught error:", err);
      if (err instanceof Yup.ValidationError) {
        console.log("Validation Errors:", err.inner);
        // Manually set errors for each field
        err.inner.forEach((error) => {
          if (error.path === "name") setNameError(error.message);
          if (error.path === "age") setAgeError(error.message);
          if (error.path === "mobile") setMobileError(error.message);
          if (error.path === "address") setAddressError(error.message);
          if (error.path === "govid") setGovidError(error.message);
          if (error.path === "password") setPasswordError(error.message);
        });
        return; // Stop execution if validation fails
      }
      if (err.response) {
        console.log("Error:", err.response.data);
        setErrorMessage(err.response.data.error || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen px-3.5">
    <div className="border p-8 rounded-xl w-full max-w-lg">
      <p className="text-2xl text-center my-6">Signup</p>
      <form>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label>Name:</label>
            <input
              className="border rounded p-1"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleInputChange(setName)}
            />
            {nameError && <p className="text-red-500">{nameError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label>Age:</label>
            <input
              className="border rounded p-1"
              type="number"
              placeholder="Age"
              value={age}
              onChange={handleInputChange(setAge)}
            />
            {ageError && <p className="text-red-500">{ageError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label>Mobile:</label>
            <input
              className="border rounded p-1"
              type="text"
              placeholder="Mobile"
              value={mobile}
              onChange={handleInputChange(setMobile)}
            />
            {mobileError && <p className="text-red-500">{mobileError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label>Address:</label>
            <input
              className="border rounded p-1"
              type="text"
              placeholder="Address"
              value={address}
              onChange={handleInputChange(setAddress)}
            />
            {addressError && <p className="text-red-500">{addressError}</p>}
          </div>

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

          <div className="text-center w-full" onClick={handleSubmit}>
            <ButtonS label="Sign-up" />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
      </form>
    </div>
    </div>
  );
};

export default Signup;