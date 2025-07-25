import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginSignup';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import LoginSignup from './pages/LoginSignup';
import Profile from './pages/Profile';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginSignup />} />
                <Route path="/profile/:userId" element={<Profile />} /> {/* User Profile Route */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
