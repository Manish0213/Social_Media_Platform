import React from 'react';
import MyProfile from './MyProfile';
import UserProfile from './UserProfile';
import { useParams } from 'react-router-dom';

const Profile = ({users, socket}) => {
    const { id } = useParams(); // userId from the URL
    const loggedInUserId = JSON.parse(localStorage.getItem('loggedInUser'))._id;

  return (
    <div className='profile-container'>
      {loggedInUserId === id ? (
        <MyProfile /> // If it's the logged-in user
      ) : (
        <UserProfile id={id} users={users} socket={socket} /> // If it's a different user
      )}
    </div>
  )
}

export default Profile
