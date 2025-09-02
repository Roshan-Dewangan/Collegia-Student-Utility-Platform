import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getResources, getFilteredResources } from '../../actions/resource';
import Spinner from '../layout/Spinner';
import ResourceCard from './ResourceCard';

const Resources = ({ getResources, getFilteredResources, resource: { resources, loading } }) => {
  useEffect(() => {
    getResources();
  }, [getResources]);
  
  const [filters, setFilters] = useState({
    subject: '',
    department: '',
    semester: '',
    resourceType: ''
  });
  
  const { subject, department, semester, resourceType } = filters;
  
  const onChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const onFilter = e => {
    e.preventDefault();
    const activeFilters = {};
    
    if (subject) activeFilters.subject = subject;
    if (department) activeFilters.department = department;
    if (semester) activeFilters.semester = semester;
    if (resourceType) activeFilters.resourceType = resourceType;
    
    getFilteredResources(activeFilters);
  };
  
  const clearFilters = () => {
    setFilters({
      subject: '',
      department: '',
      semester: '',
      resourceType: ''
    });
    getResources();
  };
  
  return loading ? (
    <Spinner />
  ) : (
    <div className="resources-container">
      <h1 className="large text-primary">Resources</h1>
      <p className="lead">
        <i className="fas fa-file-alt"></i> Browse and share educational resources
      </p>
      
      <div className="resources-header">
        <Link to="/resources/upload" className="btn btn-primary">
          <i className="fas fa-upload"></i> Upload Resource
        </Link>
      </div>
      
      <div className="resources-filters">
        <form onSubmit={onFilter}>
          <div className="filter-grid">
            <div className="form-group">
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                value={subject}
                onChange={onChange}
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Department"
                name="department"
                value={department}
                onChange={onChange}
              />
            </div>
            
            <div className="form-group">
              <input
                type="number"
                placeholder="Semester"
                name="semester"
                value={semester}
                onChange={onChange}
                min="1"
                max="8"
              />
            </div>
            
            <div className="form-group">
              <select 
                name="resourceType" 
                value={resourceType} 
                onChange={onChange}
              >
                <option value="">Select Resource Type</option>
                <option value="notes">Notes</option>
                <option value="paper">Question Papers</option>
                <option value="assignment">Assignments</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="filter-buttons">
              <button type="submit" className="btn btn-primary">
                Apply Filters
              </button>
              <button 
                type="button" 
                onClick={clearFilters} 
                className="btn btn-light"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {resources.length > 0 ? (
        <div className="resources-grid">
          {resources.map(resource => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="no-resources">
          <p>No resources found. Upload some resources or adjust your filters.</p>
        </div>
      )}
    </div>
  );
};

Resources.propTypes = {
  getResources: PropTypes.func.isRequired,
  getFilteredResources: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  resource: state.resource
});

export default connect(mapStateToProps, { getResources, getFilteredResources })(Resources);
