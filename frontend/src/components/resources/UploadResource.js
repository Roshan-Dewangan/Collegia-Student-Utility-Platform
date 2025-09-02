import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadResource } from '../../actions/resource';

const UploadResource = ({ uploadResource }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: '',
    semester: '',
    resourceType: 'notes'
  });
  
  const [file, setFile] = useState(null);
  
  const { title, description, subject, department, semester, resourceType } = formData;
  
  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const onFileChange = e => {
    setFile(e.target.files[0]);
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    if (!file) {
      alert('Please upload a file');
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    formDataToSend.append('subject', subject);
    formDataToSend.append('department', department);
    formDataToSend.append('semester', semester);
    formDataToSend.append('resourceType', resourceType);
    formDataToSend.append('file', file);
    
    uploadResource(formDataToSend, navigate);
  };
  
  return (
    <div className="container resource-form-container">
      <h1 className="large text-primary">Upload Resource</h1>
      <p className="lead">
        <i className="fas fa-upload"></i> Share your study materials with others
      </p>
      
      <form className="form" onSubmit={onSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Description"
            name="description"
            value={description}
            onChange={onChange}
            rows="5"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Subject"
            name="subject"
            value={subject}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Department"
            name="department"
            value={department}
            onChange={onChange}
            required
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
            required
          />
        </div>
        
        <div className="form-group">
          <select name="resourceType" value={resourceType} onChange={onChange} required>
            <option value="notes">Notes</option>
            <option value="paper">Question Paper</option>
            <option value="assignment">Assignment</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <h4>Upload File</h4>
          <input
            type="file"
            name="file"
            onChange={onFileChange}
            required
          />
          <small>Max file size: 25MB</small>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Upload Resource</button>
          <Link to="/resources" className="btn btn-light">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

UploadResource.propTypes = {
  uploadResource: PropTypes.func.isRequired
};

export default connect(null, { uploadResource })(UploadResource);
