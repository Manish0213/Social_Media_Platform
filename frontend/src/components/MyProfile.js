import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import user from "../images/user.png";
import MyPosts from "./MyPosts";

const MyProfile = ({setLoggedInUser}) => {
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);

  const handleLogout = () => {
    console.log("lgout triggered0");
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    setLoggedInUser(null);
    navigate('/login');
  }

  return (
    <div className="my-profile-container">
      <div className="profile-header">
        <img
          src={
            userData.profileImage
              ? `http://localhost:5000/uploads/${userData.profileImage}`
              : user
          }
          alt="Profile"
          className="profile-image"
        />
        <h2 className="profile-name">{userData.name}</h2>
        <p className="profile-description">Web Developer</p>
      </div>

      <div className="profile-actions">
        <Link to="/editprofile">
          <button className="edit-profile-btn"><i className="fa-regular fa-pen-to-square"></i></button>
        </Link>
          <button className="logout-btn" onClick={handleLogout}><i className="fa-solid fa-power-off"></i></button>
      </div>

      <div className="friends-action-container">
        <Link to="/receivedrequest" className="action-box">
          <i className="fa-solid fa-bell"></i>
          <span>Friend Requests</span>
        </Link>
        <Link to="/friendlist" className="action-box">
          <i className="fa-solid fa-user-group"></i>
          <span>Friends</span>
        </Link>
      </div>
      <MyPosts />
    </div>
  );
};

export default MyProfile;
