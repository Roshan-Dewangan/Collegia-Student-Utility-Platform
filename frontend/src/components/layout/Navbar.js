import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout, darkMode, toggleDarkMode }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/forum">Forum</Link>
      </li>
      <li>
        <Link to="/marketplace">Marketplace</Link>
      </li>
      <li>
        <Link to="/resources">Resources</Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <li>
        <Link to={`/profile/${user?._id}`}>Profile</Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
      <li>
        <button 
          onClick={toggleDarkMode} 
          className="btn-theme"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <button 
          onClick={toggleDarkMode} 
          className="btn-theme"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-university"></i> Collegia
        </Link>
      </h1>
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
