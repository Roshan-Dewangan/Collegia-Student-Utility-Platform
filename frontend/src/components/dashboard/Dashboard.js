import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/post';
import { getMarketplaceItems } from '../../actions/marketplace';
import { getResources } from '../../actions/resource';
import { getEvents } from '../../actions/event';
import Spinner from '../layout/Spinner';

const Dashboard = ({
  auth: { user },
  post: { posts, loading: postsLoading },
  marketplace: { items, loading: itemsLoading },
  resource: { resources, loading: resourcesLoading },
  event: { events, loading: eventsLoading },
  getPosts,
  getMarketplaceItems,
  getResources,
  getEvents
}) => {
  useEffect(() => {
    getPosts();
    getMarketplaceItems();
    getResources();
    getEvents();
  }, [getPosts, getMarketplaceItems, getResources, getEvents]);

  if (postsLoading || itemsLoading || resourcesLoading || eventsLoading || !user) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-container">
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <i className="fas fa-comments"></i>
          <h3>{posts.length}</h3>
          <p>Forum Posts</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-shopping-cart"></i>
          <h3>{items.length}</h3>
          <p>Marketplace Items</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-file-alt"></i>
          <h3>{resources.length}</h3>
          <p>Resources</p>
        </div>
        <div className="stat-card">
          <i className="fas fa-calendar-alt"></i>
          <h3>{events.length}</h3>
          <p>Upcoming Events</p>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <div className="recent-section">
          <h2>Recent Posts</h2>
          {posts.slice(0, 5).map(post => (
            <div key={post._id} className="recent-item">
              <div className="recent-item-title">
                <Link to={`/forum/${post._id}`}>{post.title}</Link>
              </div>
              <div className="recent-item-date">
                {new Date(post.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          <Link to="/forum" className="view-all">View All Posts</Link>
        </div>
        
        <div className="recent-section">
          <h2>Upcoming Events</h2>
          {events
            .filter(event => new Date(event.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map(event => (
              <div key={event._id} className="recent-item">
                <div className="recent-item-title">
                  <Link to={`/events/${event._id}`}>{event.title}</Link>
                </div>
                <div className="recent-item-date">
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          <Link to="/events" className="view-all">View All Events</Link>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <div className="recent-section">
          <h2>Recent Marketplace Items</h2>
          {items.slice(0, 5).map(item => (
            <div key={item._id} className="recent-item">
              <div className="recent-item-title">
                <Link to={`/marketplace/${item._id}`}>{item.title}</Link>
              </div>
              <div className="recent-item-date">
                ₹{item.price} - {item.status}
              </div>
            </div>
          ))}
          <Link to="/marketplace" className="view-all">View All Items</Link>
        </div>
        
        <div className="recent-section">
          <h2>Recent Resources</h2>
          {resources.slice(0, 5).map(resource => (
            <div key={resource._id} className="recent-item">
              <div className="recent-item-title">
                <Link to={`/resources/${resource._id}`}>{resource.title}</Link>
              </div>
              <div className="recent-item-date">
                {resource.subject} - {resource.resourceType}
              </div>
            </div>
          ))}
          <Link to="/resources" className="view-all">View All Resources</Link>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  marketplace: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  getMarketplaceItems: PropTypes.func.isRequired,
  getResources: PropTypes.func.isRequired,
  getEvents: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  post: state.post,
  marketplace: state.marketplace,
  resource: state.resource,
  event: state.event
});

export default connect(mapStateToProps, {
  getPosts,
  getMarketplaceItems,
  getResources,
  getEvents
})(Dashboard);
