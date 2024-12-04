import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userImage from "../images/user.png";

const ViewPost = () => {
  const { id } = useParams(); // Extract post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId =
    localStorage.getItem("loggedInUser") &&
    JSON.parse(localStorage.getItem("loggedInUser"))._id;

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/post/post/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log(data);
      setPost(data); // Ensure the post is set correctly
    } catch (error) {
      console.error("Error fetching post", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/post/like/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      setPost((prevPost) => ({
        ...prevPost,
        likes: data.post.likes, // Update likes
      }));
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/post/delete-post/${id}`,
        {
          method: "DELETE",
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        alert("Post deleted successfully!");
        navigate("/myprofile"); // Redirect to the user's profile
      } else {
        const data = await response.json();
        console.error("Error deleting the post:", data.message);
        alert(data.message || "Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error deleting the post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="view-post-container">
      <div className="post-container">
        {/* Post Header */}
        <div className="post-header">
          <div className="user-info">
            <img
              src={
                post.user.profileImage
                  ? `http://localhost:5000/uploads/${post.user.profileImage}`
                  : userImage
              }
              alt="User"
              className="user-image"
            />
            <div>
              <h2>{post.user.name}</h2>
              <p>{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Delete Icon (only for the owner of the post) */}
          {post.user._id === userId && (
            <button onClick={handleDelete} className="delete-icon">
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>

        {/* Post Content */}
        <p>{post.content}</p>
        {post.image && (
          <img
            src={`http://localhost:5000/${post.image}`}
            alt="Post"
            className="post-image"
          />
        )}

        {/* Like Button */}
        <button onClick={handleLike} className="like-button">
          {post.likes.includes(userId) ? (
            <i className="fas fa-thumbs-up"></i> // Unlike Icon
          ) : (
            <i className="far fa-thumbs-up"></i> // Like Icon
          )}
        </button>
        <p>{post.likes.length} Likes</p>
      </div>
    </div>
  );
};

export default ViewPost;
