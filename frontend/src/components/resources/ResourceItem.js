import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getResource, downloadResource, deleteResource } from '../../actions/resource';
import Spinner from '../layout/Spinner';

const ResourceItem = ({
  getResource,
  downloadResource,
  deleteResource,
  resource: { resource, loading },
  auth
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    getResource(id);
  }, [getResource, id]);
  
  const handleDownload = () => {
    downloadResource(id);
    window.open(`http://localhost:5000/${resource.fileUrl}`, '_blank');
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource(id);
      navigate('/resources');
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
  
  if (loading || resource === null) {
    return <Spinner />;
  }
  
  const isOwner = resource.user && auth.user && resource.user._id === auth.user._id;
  
  return (
    <div className="resource-detail-container container">
      <Link to="/resources" className="btn btn-light">
        Back To Resources
      </Link>
      
      <div className="resource-detail">
        <div className="resource-detail-header">
          <h1 className="large">{resource.title}</h1>
          <div className="resource-detail-type">
            {getResourceTypeName(resource.resourceType)}
          </div>
        </div>
        
        <div className="resource-detail-meta">
          <p><strong>Subject:</strong> {resource.subject}</p>
          <p><strong>Department:</strong> {resource.department}</p>
          <p><strong>Semester:</strong> {resource.semester}</p>
          <p><strong>Uploaded:</strong> {new Date(resource.date).toLocaleDateString()}</p>
          <p><strong>Downloads:</strong> {resource.downloads}</p>
        </div>
        
        <div className="resource-detail-description">
          <h3>Description</h3>
          <p>{resource.description}</p>
        </div>
        
        <div className="resource-detail-actions">
          <button onClick={handleDownload} className="btn btn-primary">
            <i className="fas fa-download"></i> Download
          </button>
          
          {isOwner && (
            <button onClick={handleDelete} className="btn btn-danger">
              <i className="fas fa-trash"></i> Delete
            </button>
          )}
        </div>
        
        <div className="resource-detail-uploader">
          <h3>Uploaded By</h3>
          <p>{resource.user && resource.user.name}</p>
          <Link to={`/profile/${resource.user && resource.user._id}`} className="btn btn-light btn-sm">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

ResourceItem.propTypes = {
  getResource: PropTypes.func.isRequired,
  downloadResource: PropTypes.func.isRequired,
  deleteResource: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  resource: state.resource,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getResource,
  downloadResource,
  deleteResource
})(ResourceItem);
