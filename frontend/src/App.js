import "./App.css";
import ChatBoard from "./components/ChatBoard";
import CreatePost from "./components/CreatePost";
import Home from "./components/Home";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import ReceivedRequests from "./components/ReceivedRequests";
import FriendList from "./components/FriendList";
import ChatList from "./components/ChatList";
import { io } from "socket.io-client";
import Profile from "./components/Profile";
import MyProfile from "./components/MyProfile";
import EditProfile from "./components/EditProfile";
import ViewPost from "./components/ViewPost";

function App() {
  // Sample user data
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);

  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
    fetchAllUsers();
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchChatList();
    }
  }, [token]);

  const fetchAllUsers = async () => {
    const response = await fetch("http://localhost:5000/auth/userlist");
    const data = await response.json();
    setUsers(data);
  };

  const fetchChatList = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/chat/getChatList`,
      {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    console.log(data);
    setChat(data);
  };

  // Setup Socket.IO connection
  useEffect(() => {
    if (loggedInUser) {
      const newSocket = io("http://localhost:5000", {
        query: { userId: loggedInUser._id },
        path: "/socket",
        reconnection: true,
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
      }); // Backend URL
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket server:", newSocket.id);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  return (
    <>
      <Router>
        <div className="container">
          {loggedInUser ? (
            <Navbar
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          ) : null}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatboard" element={<ChatBoard />} />
            <Route path="/search" element={<Search users={users} />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route
              path="/profile/:id"
              element={<Profile users={users} socket={socket} />}
            />
            <Route
              path="/myprofile"
              element={<MyProfile setLoggedInUser={setLoggedInUser} />}
            />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/signup" element={<Signup setToken={setToken} />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/receivedrequest" element={<ReceivedRequests />} />
            <Route path="/friendlist" element={<FriendList />} />
            <Route
              path="/chat/:chatId"
              element={<ChatBoard socket={socket} />}
            />
            <Route
              path="/chatlist"
              element={
                <ChatList
                  chat={chat}
                  socket={socket}
                  fetchChatList={fetchChatList}
                />
              }
            />
            <Route path="/view-post/:id" element={<ViewPost />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
