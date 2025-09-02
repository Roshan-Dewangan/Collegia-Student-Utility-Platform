import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const EventCard = ({ event }) => {
  const { _id, title, description, date, location, organizer, image, attendees } = event;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  const isPastEvent = new Date(date) < new Date();
  
  return (
    <div className="event-card">
      <div className="event-image">
        {image ? (
          <img src={`http://localhost:5000/${image}`} alt={title} />
        ) : (
          <img src="https://via.placeholder.com/300x180?text=Event" alt="Event" />
        )}
      </div>
      
      <div className="event-details">
        <div className="event-date-badge">
          {isPastEvent ? 'Past Event: ' : ''}{formatDate(date)} at {formatTime(date)}
        </div>
        
        <h3 className="event-title">{title}</h3>
        
        <div className="event-info">
          <p><i className="fas fa-map-marker-alt"></i> {location}</p>
          <p><i className="fas fa-user"></i> {organizer}</p>
        </div>
        
        <p className="event-description">
          {description.length > 100 ? description.substring(0, 100) + '...' : description}
        </p>
        
        <div className="event-attendees">
          <i className="fas fa-users"></i>
          <span className="event-attendees-count">
            {attendees.length} {attendees.length === 1 ? 'person' : 'people'} attending
          </span>
        </div>
        
        <div className="event-action">
          <Link to={`/events/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.object.isRequired
};

export default EventCard;
