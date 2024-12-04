import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import userImage from "../images/user.png";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId =
    localStorage.getItem("loggedInUser") &&
    JSON.parse(localStorage.getItem("loggedInUser"))._id;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post/my-posts`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log("my posts is", data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  const handleLike = () => {};

  return (
    <div className="user-post-container">
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <div className="user-info">
              <img
                src={
                  post.user.profileImage
                    ? `${process.env.REACT_APP_API_URL}/uploads/${post.user.profileImage}`
                    : userImage
                }
                alt="User"
                className="user-image"
              />

              <div>
                <h2>{post.user.name}</h2>
                <p className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}{" "}
                  {/* Format date */}
                </p>
              </div>
            </div>
            <Link to={`/view-post/${post._id}`}>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </Link>
          </div>
          <p>{post.content}</p>
          {post.image && (
            <img
              src={`${process.env.REACT_APP_API_URL}/${post.image}`}
              alt="Post"
              className="post-image"
            />
          )}
          <button onClick={() => handleLike(post._id)} className="like-button">
            {post.likes.includes(userId) ? (
              <i className="fas fa-thumbs-up"></i> // Icon for "Unlike"
            ) : (
              <i className="far fa-thumbs-up"></i> // Icon for "Like"
            )}
          </button>
          <p>{post.likes.length} Likes</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default MyPosts;
