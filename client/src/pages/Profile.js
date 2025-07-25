// Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { userId } = useParams(); // Assuming userId is passed in the URL
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUserData(data);
                } else {
                    setError(data.message || 'Failed to fetch user data.');
                }
            } catch (err) {
                setError('An error occurred while fetching user data.');
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={userData.profilePhoto} alt={`${userData.name}'s profile`} className="profile-photo" />
                <h1>{userData.name}</h1>
                <div className="follow-info">
                    <span>{userData.followers.length} Followers</span>
                    <span>{userData.following.length} Following</span>
                </div>
            </div>
            <div className="user-posts">
                <h2>User Posts</h2>
                {userData.posts.length > 0 ? (
                    userData.posts.map((post, index) => (
                        <div key={index} className="post">
                            <img src={post.image} alt={post.caption} className="post-image" />
                            <p>{post.caption}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts to show</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
