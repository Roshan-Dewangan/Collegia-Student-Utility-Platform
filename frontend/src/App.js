import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import Forum from './components/forum/Forum';
import Post from './components/forum/Post';
import Marketplace from './components/marketplace/Marketplace';
import MarketplaceItem from './components/marketplace/MarketplaceItem';
import CreateListing from './components/marketplace/CreateListing';
import Resources from './components/resources/Resources';
import ResourceItem from './components/resources/ResourceItem';
import UploadResource from './components/resources/UploadResource';
import Events from './components/events/Events';
import EventItem from './components/events/EventItem';
import CreateEvent from './components/events/CreateEvent';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/profile/UpdateProfile';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    store.dispatch(loadUser());
    
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Alert />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
            <Route path="/forum" element={<PrivateRoute component={Forum} />} />
            <Route path="/forum/:id" element={<PrivateRoute component={Post} />} />
            <Route path="/marketplace" element={<PrivateRoute component={Marketplace} />} />
            <Route path="/marketplace/:id" element={<PrivateRoute component={MarketplaceItem} />} />
            <Route path="/marketplace/create" element={<PrivateRoute component={CreateListing} />} />
            <Route path="/resources" element={<PrivateRoute component={Resources} />} />
            <Route path="/resources/:id" element={<PrivateRoute component={ResourceItem} />} />
            <Route path="/resources/upload" element={<PrivateRoute component={UploadResource} />} />
            <Route path="/events" element={<PrivateRoute component={Events} />} />
            <Route path="/events/:id" element={<PrivateRoute component={EventItem} />} />
            <Route path="/events/create" element={<PrivateRoute component={CreateEvent} />} />
            <Route path="/profile/:id" element={<PrivateRoute component={Profile} />} />
            <Route path="/profile/update" element={<PrivateRoute component={UpdateProfile} />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
