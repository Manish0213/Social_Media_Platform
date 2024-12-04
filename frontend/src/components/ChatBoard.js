import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Messages from "./Messages";
import userImage from "../images/user.png";

const ChatBoard = ({socket}) => {
  const { chatId } = useParams();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    if (socket && chatId) {

      // If there's already a room, leave it before joining the new one
      if (currentRoom) {
        socket.emit('leaveRoom', currentRoom);
      }

      // Join the room
      socket.emit('joinRoom', chatId);

      // Fetch previous messages
      socket.on('previousMessages', (msgs) => {
        setMessages(msgs);
      });

      // Listen for new messages
      socket.on('receiveMessage', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', chatId);
        socket.off('previousMessages');
        socket.off('receiveMessage');
      }
    };
  }, [socket, chatId]);

  useEffect(() => {
    fetchWithChatUser();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const loggedInUserId = loggedInUser._id;

      const selectedParticipant = selectedUser.participants.find(
        (participant) => participant._id !== loggedInUserId
      );
      setChatPartner(selectedParticipant);
    }
  }, [selectedUser]);

  const fetchWithChatUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/fetchChatWithUser/${chatId}`
    );
    const data = await response.json();
    setSelectedUser(data);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const loggedInUserId = loggedInUser._id;
    if (socket && newMessage) {
      socket.emit('sendMessage', { chatId, newMessage, loggedInUserId });
      setNewMessage("");
    }
  };

  return (
    <div className="chatboard-container">
      <div className="chat-header">
        <img src={userImage} alt="User" className="chat-user-image" />
        <span className="chat-user-name">{chatPartner !== null ? chatPartner.name : "Loading..."}</span>
      </div> 
      <Messages messages={messages} />
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBoard;
