import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = ({ setToken }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    cPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("token", data.authToken);
      localStorage.setItem("loggedInUser", JSON.stringify(data.newUser));
      setToken(data.authToken);
      navigate("/");
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Your Account</h2>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Name</label>
          <br />
          <input
            type="text"
            className="email-input"
            placeholder="Enter Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail2">Username</label>
          <br />
          <input
            type="text"
            className="username-input"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Password</label>
          <br />
          <input
            type="password"
            className="password-input"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Confirm Password</label>
          <br />
          <input
            type="password"
            className="email-input"
            placeholder="Password"
            name="cPassword"
            value={formData.cPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="register-link">
        <p>
          Already a user? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
