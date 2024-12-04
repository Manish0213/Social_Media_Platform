import React, { useEffect, useState } from "react";

const ReceivedRequests = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/received-requests/${loggedInUser._id}`
      );
      const data = await response.json();

      if (data.success) {
        setFriendRequests(data.friendRequests);
      } else {
        console.error("Failed to fetch friend requests:", data.message);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/accept-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );
      const data = await response.json();

      if (data) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/friend/reject-request/${requestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data) {
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div className="received-requests-container">
      <h3>Received Friend Requests</h3>
      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <div key={request._id} className="friend-request">
            <p>{request.sender.name} sent you a friend request</p>
            <div>
              <button
                className="accept-btn"
                onClick={() => handleAcceptRequest(request._id)}
              >
                <i className="fa-solid fa-check"></i>
              </button>
              <button
                className="reject-btn"
                onClick={() => handleRejectRequest(request._id)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No friend requests received.</p>
      )}
    </div>
  );
};

export default ReceivedRequests;
