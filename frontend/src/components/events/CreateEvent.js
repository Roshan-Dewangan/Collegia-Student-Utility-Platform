import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createEvent } from '../../actions/event';

const CreateEvent = ({ createEvent }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: ''
  });
  
  const [image, setImage] = useState(null);
  
  const { title, description, date, time, location, organizer } = formData;
  
  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const onFileChange = e => {
    setImage(e.target.files[0]);
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    
    const eventDateTime = new Date(`${date}T${time}`);
    formDataToSend.append('date', eventDateTime.toISOString());
    
    formDataToSend.append('location', location);
    formDataToSend.append('organizer', organizer);
    
    if (image) {
      formDataToSend.append('image', image);
    }
    
    createEvent(formDataToSend, navigate);
  };
  
  return (
    <div className="container event-form-container">
      <h1 className="large text-primary">Create Event</h1>
      <p className="lead">
        <i className="fas fa-calendar-plus"></i> Create a new event for the campus
      </p>
      
      <form className="form" onSubmit={onSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Event Description"
            name="description"
            value={description}
            onChange={onChange}
            rows="5"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <h4>Event Date</h4>
          <input
            type="date"
            name="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <h4>Event Time</h4>
          <input
            type="time"
            name="time"
            value={time}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Event Location"
            name="location"
            value={location}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Event Organizer"
            name="organizer"
            value={organizer}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <h4>Event Image</h4>
          <input
            type="file"
            name="image"
            onChange={onFileChange}
            accept="image/*"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Event</button>
          <Link to="/events" className="btn btn-light">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

CreateEvent.propTypes = {
  createEvent: PropTypes.func.isRequired
};

export default connect(null, { createEvent })(CreateEvent);
