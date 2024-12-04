import React, { useEffect, useState } from "react";
import userImage from "../images/user.png";
import { useNavigate } from "react-router-dom";
import UserPosts from "./UserPosts";

const UserProfile = ({ id, users, socket }) => {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const user = users.find((user) => user._id === id);

  const [friendStatus, setFriendStatus] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/friend/getfriendrequest/${id}/${loggedInUser._id}`
    );
    const data = await response.json();
    console.log(data);
    if (data.success === true) setFriendStatus(data.friendRequest);
    else setFriendStatus(data);
  };

  const handleAcceptRequest = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/friend/accept-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: friendStatus._id }),
      }
    );
    const data = await response.json();
    setFriendStatus(data);
  };

  const handleRejectRequest = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/friend/reject-request/${friendStatus._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setFriendStatus({ status: "none" });
  };

  const handleCancelRequest = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/cancel-request/${friendStatus._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFriendStatus({ status: "none" });
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  };

  const handleSendRequest = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/friend/send-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId: loggedInUser._id, receiverId: id }),
    });
    const data = await response.json();
    console.log(data);
    setFriendStatus(data);
  };

  const handleUnfriend = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/unfriend/${friendStatus._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFriendStatus({ status: "none" });
    } catch (error) {
      console.error("Failed to unfriend:", error);
    }
  };

  const handleUserClick = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/createChat`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender_id: user._id,
          receiver_id: JSON.parse(localStorage.getItem("loggedInUser"))._id,
        }),
      }
    );
    const data = await response.json();
    navigate(`/chat/${data._id}`);
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <img
          src={
            user.profileImage
              ? `${process.env.REACT_APP_API_URL}/uploads/${user.profileImage}`
              : userImage
          }
          alt="User Profile"
          className="profile-image"
        />
        <h2>{user && user.name}</h2>
        <p className="profile-description">Web Developer</p>
      </div>

      {id !== loggedInUser._id && (
        <div className="profile-actions">
          {friendStatus && friendStatus.status === "none" && (
            <button className="friend-request-btn" onClick={handleSendRequest}>
              Add Friend
            </button>
          )}

          {friendStatus && friendStatus.status === "accepted" && (
            <button className="unfriend-btn" onClick={handleUnfriend}>
              Unfriend
            </button>
          )}

          {friendStatus && friendStatus.status === "pending" && (
            <>
              {friendStatus.sender !== loggedInUser._id ? (
                <>
                  <button className="accept-btn" onClick={handleAcceptRequest}>
                    Accept
                  </button>
                  <button className="reject-btn" onClick={handleRejectRequest}>
                    Reject
                  </button>
                </>
              ) : (
                <button className="cancel-btn" onClick={handleCancelRequest}>
                  Cancel
                </button>
              )}
            </>
          )}

          {friendStatus && friendStatus.status === "accepted" && (
            <button className="message-btn" onClick={handleUserClick}>
              Message
            </button>
          )}
        </div>
      )}

      <UserPosts id={id} />
    </div>
  );
};

export default UserProfile;
