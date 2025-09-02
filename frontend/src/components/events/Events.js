import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getEvents } from '../../actions/event';
import Spinner from '../layout/Spinner';
import EventCard from './EventCard';

const Events = ({ getEvents, event: { events, loading } }) => {
  useEffect(() => {
    getEvents();
  }, [getEvents]);
  
  const [filter, setFilter] = useState('upcoming');
  
  const filterEvents = () => {
    const today = new Date();
    
    if (filter === 'upcoming') {
      return events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filter === 'past') {
      return events
        .filter(event => new Date(event.date) < today)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  return loading ? (
    <Spinner />
  ) : (
    <div className="events-container">
      <h1 className="large text-primary">Events</h1>
      <p className="lead">
        <i className="fas fa-calendar-alt"></i> Discover and join campus events
      </p>
      
      <div className="events-header">
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('upcoming')} 
            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-light'}`}
          >
            Upcoming Events
          </button>
          <button 
            onClick={() => setFilter('past')} 
            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-light'}`}
          >
            Past Events
          </button>
          <button 
            onClick={() => setFilter('all')} 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-light'}`}
          >
            All Events
          </button>
        </div>
        
        <Link to="/events/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Create Event
        </Link>
      </div>
      
      <div className="events-list">
        {filterEvents().length > 0 ? (
          filterEvents().map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

Events.propTypes = {
  getEvents: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  event: state.event
});

export default connect(mapStateToProps, { getEvents })(Events);
