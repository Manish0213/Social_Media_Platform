import React, { useEffect, useState } from "react";

const FriendList = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/friend/friends/${loggedInUser._id}`
      );
      const data = await response.json();
      if (data) {
        setFriends(data);
      } else {
        console.error("Failed to fetch friends list:", data.message);
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };

  return (
    <div className="friend-list-container">
      <h3>Your Friends</h3>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend._id} className="friend-item">
            <p>{friend.friend.name}</p>
          </div>
        ))
      ) : (
        <p>No friends found.</p>
      )}
    </div>
  );
};

export default FriendList;
