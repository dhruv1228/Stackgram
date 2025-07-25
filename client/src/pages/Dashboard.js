import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faSearch,
    faCompass,
    faFilm,
    faEnvelope,
    faBell,
    faUser,
} from '@fortawesome/free-solid-svg-icons';



const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(''); // Added userId state
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState('home');
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Session expired. Please log in again.');
            navigate('/login');
        } else {
            const fetchUserData = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/dashboard', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    if (response.ok) {
                        setUserName(data.name);
                        setUserId(data.id); // Assuming the user ID is returned in the response
                    } else {
                        setError(data.message || 'An error occurred while validating the session.');
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                } catch (err) {
                    setError('An error occurred while validating the session.');
                }
            };

            fetchUserData();
        }
    }, [navigate]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/search?name=${searchQuery}`);
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data.users);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        }
    };

    const renderSearchResults = () => {
        if (searchResults.length > 0) {
            return searchResults.map((user, index) => (
                <div
                    key={index}
                    style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px',
                        backgroundColor: '#f9f9f9',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/profile/${user.id}`)} // Navigate to user's profile
                >
                    {user.name}
                </div>
            ));
        }
        return (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>No user found</p>
        );
    };

    const renderContent = () => {
        if (currentPage === 'search') {
            return (
                <section>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Search Users</h2>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '10px',
                                width: '60%',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                marginRight: '10px',
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Search
                        </button>
                    </div>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>{renderSearchResults()}</div>
                </section>
            );
        }
        return (
            <>
                {/* Stories */}
                <section
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        minHeight: '100px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                    }}
                >
                    <p>No stories available</p>
                </section>

                {/* Posts */}
                <section>
                    <p>No posts to show</p>
                </section>
            </>
        );
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <header
                style={{
                    backgroundColor: '#fff',
                    padding: '10px 20px',
                    textAlign: 'center',
                    borderBottom: '1px solid #ddd',
                    fontSize: '24px',
                    fontWeight: 'bold',
                }}
            >
                Stackgram - Welcome {userName || 'Guest'}
            </header>

            {/* Main Content */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <aside
                    style={{
                        width: '200px',
                        borderRight: '1px solid #ddd',
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => setCurrentPage('home')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faHome} size="lg" /> Home
                            </button>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => setCurrentPage('search')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faSearch} size="lg" /> Search
                            </button>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => navigate('/explore')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faCompass} size="lg" /> Explore
                            </button>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => navigate('/reels')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faFilm} size="lg" /> Reels
                            </button>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => navigate('/messages')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faEnvelope} size="lg" /> Messages
                            </button>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => navigate('/notifications')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faBell} size="lg" /> Notifications
                            </button>
                        </li>
                        <li style={{ marginBottom: '20px' }}>
                            <button
                                onClick={() => navigate(`/profile/${userId}`)} // Link to profile page
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    fontSize: '18px',
                                }}
                            >
                                <FontAwesomeIcon icon={faUser} size="lg" /> Profile
                            </button>
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main
                    style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                    }}
                >
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
