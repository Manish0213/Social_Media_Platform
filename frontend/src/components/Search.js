import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Search = ({users}) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    // Update filteredUsers whenever users prop changes
    setFilteredUsers(users);
  }, [users]);

  // Function to handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter users based on search query
    const matches = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(matches);
  };

  return (
    <div className="search-container">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* User List */}
      <ul className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user,index) => <Link key={index} to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "black" }}><li key={user._id}>{user.name}</li></Link>)
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
};

export default Search;
