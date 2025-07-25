import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token; // Check if token exists

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
