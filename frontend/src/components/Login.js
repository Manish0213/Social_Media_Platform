import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success === true) {
      localStorage.setItem("token", data.authToken);
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      setToken(data);
      navigate("/");
    }
    else {
      setErrorMessage(data.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Username</label>
          <br />
          <input
            type="text"
            className="user-input"
            id="exampleInputEmail1"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <br />
          <input
            type="password"
            className="password-input"
            id="exampleInputPassword1"
            placeholder="Password"
            name="password"
            value={formData.password}
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
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
