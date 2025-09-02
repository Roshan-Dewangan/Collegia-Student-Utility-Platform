import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createMarketplaceItem } from '../../actions/marketplace';

const CreateListing = ({ createMarketplaceItem }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'book',
    price: '',
    condition: 'new'
  });
  
  const [images, setImages] = useState([]);
  
  const { title, description, category, price, condition } = formData;
  
  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const onFileChange = e => {
    setImages(e.target.files);
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    formDataToSend.append('category', category);
    formDataToSend.append('price', price);
    formDataToSend.append('condition', condition);
    
    for (let i = 0; i < images.length; i++) {
      formDataToSend.append('images', images[i]);
    }
    
    createMarketplaceItem(formDataToSend, navigate);
  };
  
  return (
    <div className="container marketplace-form-container">
      <h1 className="large text-primary">Create Marketplace Listing</h1>
      <p className="lead">
        <i className="fas fa-shopping-cart"></i> List an item for sale
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
          <select name="category" value={category} onChange={onChange} required>
            <option value="book">Book</option>
            <option value="equipment">Equipment</option>
            <option value="others">Others</option>
          </select>
        </div>
        
        <div className="form-group">
          <input
            type="number"
            placeholder="Price (₹)"
            name="price"
            value={price}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <select name="condition" value={condition} onChange={onChange} required>
            <option value="new">New</option>
            <option value="like new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        
        <div className="form-group">
          <h4>Upload Images (Max 5)</h4>
          <input
            type="file"
            name="images"
            onChange={onFileChange}
            multiple
            accept="image/*"
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create Listing</button>
          <Link to="/marketplace" className="btn btn-light">Cancel</Link>
        </div>
      </form>
    </div>
  );
};

CreateListing.propTypes = {
  createMarketplaceItem: PropTypes.func.isRequired
};

export default connect(null, { createMarketplaceItem })(CreateListing);
