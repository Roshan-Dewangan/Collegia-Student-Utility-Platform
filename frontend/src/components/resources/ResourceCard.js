import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ResourceCard = ({ resource }) => {
  const { _id, title, description, subject, department, semester, resourceType, downloads, date } = resource;
  
  const getResourceIcon = (type) => {
    switch (type) {
      case 'notes':
        return 'fas fa-sticky-note';
      case 'paper':
        return 'fas fa-file-alt';
      case 'assignment':
        return 'fas fa-tasks';
      default:
        return 'fas fa-file';
    }
  };
  
  const getResourceTypeName = (type) => {
    switch (type) {
      case 'notes':
        return 'Notes';
      case 'paper':
        return 'Question Paper';
      case 'assignment':
        return 'Assignment';
      default:
        return 'Other';
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div className="resource-card">
      <div className="resource-icon">
        <i className={getResourceIcon(resourceType)}></i>
      </div>
      
      <h3 className="resource-title">{title}</h3>
      
      <div className="resource-info">
        <p>{subject} | Semester {semester}</p>
        <p>{department}</p>
        <p className="resource-type">{getResourceTypeName(resourceType)}</p>
      </div>
      
      <p className="resource-description">{description.substring(0, 100)}...</p>
      
      <div className="resource-meta">
        <span className="resource-downloads">
          <i className="fas fa-download"></i> {downloads} downloads
        </span>
        <span className="resource-date">
          <i className="fas fa-calendar-alt"></i> {formatDate(date)}
        </span>
      </div>
      
      <div className="resource-actions">
        <Link to={`/resources/${_id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

ResourceCard.propTypes = {
  resource: PropTypes.object.isRequired
};

export default ResourceCard;
