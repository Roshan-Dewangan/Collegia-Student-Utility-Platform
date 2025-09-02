import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMarketplaceItem, updateMarketplaceItem, deleteMarketplaceItem } from '../../actions/marketplace';
import Spinner from '../layout/Spinner';

const MarketplaceItem = ({
  getMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  marketplace: { item, loading },
  auth
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    getMarketplaceItem(id);
  }, [getMarketplaceItem, id]);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    status: ''
  });

  useEffect(() => {
    if (item && !loading) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        condition: item.condition || '',
        status: item.status || ''
      });
    }
  }, [item, loading]);

  const { title, description, price, condition, status } = formData;

  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    updateMarketplaceItem(id, formData);
    setEditing(false);
  };

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteMarketplaceItem(id);
      navigate('/marketplace');
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'book':
        return 'Book';
      case 'equipment':
        return 'Equipment';
      case 'others':
        return 'Other';
      default:
        return category;
    }
  };
  
  const getConditionText = (condition) => {
    switch (condition) {
      case 'new':
        return 'New';
      case 'like new':
        return 'Like New';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'poor':
        return 'Poor';
      default:
        return condition;
    }
  };

  const isOwner = item && auth.user && item.user === auth.user._id;

  return loading || item === null ? (
    <Spinner />
  ) : (
    <div className="marketplace-detail-container container">
      <Link to="/marketplace" className="btn btn-light">
        Back To Marketplace
      </Link>
      
      <div className="marketplace-detail">
        {editing ? (
          <form onSubmit={onSubmit} className="edit-form">
            <h2>Edit Listing</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                rows="5"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select name="condition" value={condition} onChange={onChange} required>
                <option value="new">New</option>
                <option value="like new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={status} onChange={onChange} required>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(false)} 
                className="btn btn-light"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="marketplace-detail-header">
              <h1 className="large">{item.title}</h1>
              <div className="marketplace-detail-status">
                Status: <span className={`status-${item.status}`}>{item.status}</span>
              </div>
            </div>
            
            <div className="marketplace-detail-images">
              {item.images && item.images.length > 0 ? (
                item.images.map((image, index) => (
                  <div key={index} className="marketplace-detail-image">
                    <img src={`http://localhost:5000/${image}`} alt={`Item ${index + 1}`} />
                  </div>
                ))
              ) : (
                <div className="marketplace-detail-image">
                  <img src="https://via.placeholder.com/600x400?text=No+Image" alt="No image available" />
                </div>
              )}
            </div>
            
            <div className="marketplace-detail-info">
              <div className="marketplace-detail-price">
                <h2>₹{item.price}</h2>
              </div>
              
              <div className="marketplace-detail-meta">
                <p><strong>Category:</strong> {getCategoryText(item.category)}</p>
                <p><strong>Condition:</strong> {getConditionText(item.condition)}</p>
                <p><strong>Listed:</strong> {new Date(item.date).toLocaleDateString()}</p>
              </div>
              
              <div className="marketplace-detail-description">
                <h3>Description</h3>
                <p>{item.description}</p>
              </div>
              
              <div className="marketplace-detail-seller">
                <h3>Seller Information</h3>
                <p><strong>Contact:</strong> {item.user && item.user.email}</p>
              </div>
              
              {isOwner && (
                <div className="marketplace-detail-actions">
                  <button 
                    onClick={() => setEditing(true)} 
                    className="btn btn-primary"
                  >
                    Edit Listing
                  </button>
                  <button 
                    onClick={onDelete} 
                    className="btn btn-danger"
                  >
                    Delete Listing
                  </button>
                </div>
              )}
              
              {!isOwner && item.status === 'available' && (
                <div className="marketplace-detail-contact">
                  <h3>Interested?</h3>
                  <p>Contact the seller via email.</p>
                  <a 
                    href={`mailto:${item.user && item.user.email}?subject=Regarding: ${item.title}`} 
                    className="btn btn-primary"
                  >
                    <i className="fas fa-envelope"></i> Contact Seller
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

MarketplaceItem.propTypes = {
  getMarketplaceItem: PropTypes.func.isRequired,
  updateMarketplaceItem: PropTypes.func.isRequired,
  deleteMarketplaceItem: PropTypes.func.isRequired,
  marketplace: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  marketplace: state.marketplace,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem
})(MarketplaceItem);
