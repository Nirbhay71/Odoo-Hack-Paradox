import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, HelpCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <HelpCircle className="navbar-icon" />
          StackIt
        </Link>
        
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link to="/ask" className="navbar-link">
                Ask Question
              </Link>
              <div className="navbar-user">
                <Link to={`/profile/${user?.id}`} className="navbar-user-link">
                  <User className="navbar-icon" />
                  {user?.username}
                </Link>
                <button onClick={handleLogout} className="navbar-logout-btn">
                  <LogOut className="navbar-icon" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};