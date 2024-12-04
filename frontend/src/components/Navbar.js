import React from "react";
import user from "../images/user.png";
import { Link } from "react-router-dom";

const Navbar = ({ loggedInUser }) => {
  return (
    <div className="navbar">
      <div className="navbar-links">
        <Link to="/">
          <i className="fa fa-home"></i>
        </Link>
        <Link to="/search">
          <i className="fa fa-search"></i>
        </Link>
        <Link to="/createpost">
          <i className="fa fa-plus-circle"></i>
        </Link>
        <Link to="/chatlist">
          <i className="fa-regular fa-message"></i>
        </Link>
        {loggedInUser && (
          <Link to="/myprofile" className="navbar-profile">
            <img
              src={
                JSON.parse(localStorage.getItem("loggedInUser"))?.profileImage
                  ? `${process.env.REACT_APP_API_URL}/uploads/${
                      JSON.parse(localStorage.getItem("loggedInUser"))
                        .profileImage
                    }`
                  : user
              }
              alt="User Profile"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
