import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, loading } = useSelector((state) => state.auth);
    console.log("user from the protected route", user);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Handle the case where we have a token but user data hasn't loaded yet
    if (token && !user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        if (user?.role === 'manager') {
            return <Navigate to="/manager/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;