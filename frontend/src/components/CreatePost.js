import React, { useState } from "react";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const data = new FormData();
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      setLoading(true);
      setMessage("");

      // Make POST request using fetch
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post/createpost`, {
        method: "POST",
        body: data,
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Post created successfully!");
        setFormData({ content: "", location: "", image: null });
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to create post. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          className="input-textarea"
          placeholder="write something..."
          rows={8}
        />
        <div className="file-upload-container">
          <span>Add to Your Post</span>
          <div className="file-icon-container">
          <label htmlFor="image-upload" className="image-upload-icon">
          <i className="fa fa-image"></i>
          </label>
          <input
            id="image-upload"
            type="file"
            name="image"
            onChange={handleChange}
            className="hidden-input"
          />
          <label htmlFor="image-upload" className="image-upload-icon">
          <i className="fa-solid fa-video"></i>
          </label>
          <input
            id="image-upload"
            type="file"
            name="image"
            onChange={handleChange}
            className="hidden-input"
          />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreatePost;
