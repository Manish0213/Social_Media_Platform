import React, { useEffect, useState } from "react";

const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const response = await fetch(`http://localhost:5000/auth/profile`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    setUserData(data);
    setImagePreview(
      data.profileImage
        ? `http://localhost:5000/uploads/${data.profileImage}`
        : "https://via.placeholder.com/150"
    );
  };

  const handleSave = async () => {
    const formData = new FormData();

    // Append all fields to the formData
    formData.append("name", userData.name);
    formData.append("username", userData.username);
    if (userData.image) {
      formData.append("profileImage", userData.image); // Append the file
    }

    try {
      const response = await fetch("http://localhost:5000/auth/profile", {
        method: "PUT", // Update profile
        headers: {
          token: localStorage.getItem("token"),
        },
        body: formData, // Send formData
      });

      const result = await response.json();
      localStorage.setItem("loggedInUser", JSON.stringify(result.user));

      if (response.ok) {
        alert("Profile updated successfully!");
        fetchUserProfile(); // Refresh profile data
      } else {
        alert(`Failed to update profile: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];

      // Generate a preview of the image using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);

      setUserData({
        ...userData,
        [name]: file, // Update the userData with the file object
      });
    } else {
      setUserData({
        ...userData,
        [name]: value, // Update other fields
      });
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      <div className="profile-image-section">
        <img
          src={imagePreview || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profile-image"
        />
        <label htmlFor="image-upload" className="upload-btn">
          Change Image
        </label>
        <input
          type="file"
          id="image-upload"
          name="image"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      <form className="edit-profile-form">
        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name || ""}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        {/* Username Input */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username || ""}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>

        {/* Save Button */}
        <button type="button" className="save-profile-btn" onClick={handleSave}>
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
