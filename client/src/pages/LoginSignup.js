import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/LoginSignup.css';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Session expired. Please log in again.');
            navigate('/login'); // Redirect to login if no token
        }
    }, [navigate]);

    return <div>Welcome to your Dashboard!</div>;
};

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle forgot password form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        try {
            let url;
            let body;
    
            if (isForgotPassword) {
                url = 'http://localhost:5000/api/auth/forgot-password';
                body = { email };
            } else if (isLogin) {
                url = 'http://localhost:5000/api/auth/login';
                body = { email, password };
            } else {
                if (password !== confirmPassword) {
                    setError('Passwords do not match!');
                    return;
                }
                url = 'http://localhost:5000/api/auth/register';
                body = { name, email, password };
            }
    
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
    
            const data = await response.json();
            console.log('Response:', data);
    
            if (response.ok) {
                if (isForgotPassword) {
                    setSuccess('An email with your credentials has been sent.');
                } else if (isLogin) {
                    localStorage.setItem('token', data.token);
                    alert('Login Successful');
                    navigate('/dashboard');
                } else {
                    alert('Signup Successful! Please login.');
                    setIsLogin(true);
                }
            } else {
                setError(data.message || 'An error occurred.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-signup-container">
            <div className="form-box">
                <h1>{isForgotPassword ? 'Forgot Password' : isLogin ? 'Stackgram' : 'Signup'}</h1>
                <form onSubmit={handleSubmit}>
                    {!isLogin && !isForgotPassword && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {!isForgotPassword && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    )}
                    {!isLogin && !isForgotPassword && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}
                    {isLogin && !isForgotPassword && (
                        <div className="forgot-password-container">
                            <span
                                className="forgot-password-link"
                                onClick={() => setIsForgotPassword(true)}
                            >
                                Forgot password?
                            </span>
                        </div>
                    )}
                    <button type="submit" className="button-34">
                        {isForgotPassword ? 'Send Email' : isLogin ? 'Login' : 'Signup'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                {!isForgotPassword && (
                    <div className="toggle-container">
                        <p>
                            {isLogin ? "Don’t have an account?" : 'Already have an account?'}
                            <span
                                className="toggle-link"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? ' Signup' : ' Login'}
                            </span>
                        </p>
                    </div>
                )}
                {isForgotPassword && (
                    <p
                        className="toggle-link"
                        onClick={() => setIsForgotPassword(false)}
                    >
                        Back to Login
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;
