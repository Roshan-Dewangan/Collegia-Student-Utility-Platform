import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getEvent, toggleAttendance, deleteEvent } from '../../actions/event';
import Spinner from '../layout/Spinner';

const EventItem = ({
  getEvent,
  toggleAttendance,
  deleteEvent,
  event: { event, loading },
  auth
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    getEvent(id);
  }, [getEvent, id]);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      navigate('/events');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  if (loading || event === null) {
    return <Spinner />;
  }
  
  const isAttending = event.attendees.some(
    attendee => attendee.user._id === auth.user._id
  );
  
  const isPastEvent = new Date(event.date) < new Date();
  const isOwner = event.user._id === auth.user._id;
  
  return (
    <div className="event-detail-container container">
      <Link to="/events" className="btn btn-light">
        Back To Events
      </Link>
      
      <div className="event-detail">
        <div className="event-detail-header">
          <h1 className="large">{event.title}</h1>
          
          {isPastEvent ? (
            <div className="event-status past-event">Past Event</div>
          ) : (
            <div className="event-status upcoming-event">Upcoming Event</div>
          )}
        </div>
        
        <div className="event-detail-image">
          {event.image ? (
            <img src={`http://localhost:5000/${event.image}`} alt={event.title} />
          ) : (
            <img src="https://via.placeholder.com/800x400?text=Event" alt="Event" />
          )}
        </div>
        
        <div className="event-detail-info">
          <div className="event-detail-meta">
            <p><i className="fas fa-calendar-alt"></i> <strong>Date:</strong> {formatDate(event.date)}</p>
            <p><i className="fas fa-clock"></i> <strong>Time:</strong> {formatTime(event.date)}</p>
            <p><i className="fas fa-map-marker-alt"></i> <strong>Location:</strong> {event.location}</p>
            <p><i className="fas fa-user"></i> <strong>Organizer:</strong> {event.organizer}</p>
          </div>
          
          <div className="event-detail-description">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>
          
          <div className="event-detail-attendees">
            <h3>Attendees ({event.attendees.length})</h3>
            <div className="attendees-list">
              {event.attendees.length > 0 ? (
                event.attendees.map(attendee => (
                  <div key={attendee.user._id} className="attendee">
                    <img 
                      src={attendee.user.profilePicture || `https://gravatar.com/avatar/${attendee.user._id}?d=mm&r=pg&s=40`} 
                      alt={attendee.user.name} 
                    />
                    <span>{attendee.user.name}</span>
                  </div>
                ))
              ) : (
                <p>No attendees yet</p>
              )}
            </div>
          </div>
          
          <div className="event-detail-actions">
            {!isPastEvent && (
              <button 
                onClick={() => toggleAttendance(event._id)} 
                className={`btn ${isAttending ? 'btn-danger' : 'btn-success'}`}
                disabled={isOwner}
              >
                {isAttending ? (
                  <><i className="fas fa-times"></i> Cancel Attendance</>
                ) : (
                  <><i className="fas fa-check"></i> Attend Event</>
                )}
              </button>
            )}
            
            {isOwner && (
              <button onClick={handleDelete} className="btn btn-danger">
                <i className="fas fa-trash"></i> Delete Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

EventItem.propTypes = {
  getEvent: PropTypes.func.isRequired,
  toggleAttendance: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getEvent,
  toggleAttendance,
  deleteEvent
})(EventItem);
