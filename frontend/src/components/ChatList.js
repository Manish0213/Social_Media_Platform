import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatList = ({ chat, socket, fetchChatList }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      // Set up the listener
      socket.on("updateChatList", () => {
        fetchChatList(); // Fetch chat list whenever a new message is received
      });
    }
  }, [socket]);

  const handleChatClick = (chatItem) => {
    navigate(`/chat/${chatItem._id}`); // Navigate to the chat route based on chat ID
  };

  return (
    <div className="chatlist-container">
      <h2>Chats</h2>
      {chat.length === 0 ? (
        <p>No chats available. Start a new conversation!</p>
      ) : (
        <ul>
          {chat.map((chatItem) => {
            const otherParticipant = chatItem.participants.find(
              (participant) =>
                participant._id !==
                JSON.parse(localStorage.getItem("loggedInUser"))._id
            );
            return (
              <li key={chatItem._id} onClick={() => handleChatClick(chatItem)}>
                {otherParticipant ? otherParticipant.name : "Unknown User"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
