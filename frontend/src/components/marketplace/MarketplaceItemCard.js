import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MarketplaceItemCard = ({ item }) => {
  const { _id, title, price, category, condition, status, images, date } = item;
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'sold':
        return 'status-sold';
      case 'reserved':
        return 'status-reserved';
      default:
        return '';
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
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
  
  return (
    <div className="marketplace-item">
      <div className="marketplace-item-image">
        {images && images.length > 0 ? (
          <img src={`http://localhost:5000/${images[0]}`} alt={title} />
        ) : (
          <img src="https://via.placeholder.com/300x200?text=No+Image" alt="Placeholder" />
        )}
      </div>
      
      <div className="marketplace-item-details">
        <h3 className="marketplace-item-title">{title}</h3>
        <p className="marketplace-item-price">₹{price}</p>
        
        <div className="marketplace-item-info">
          <span className="marketplace-item-category">{getCategoryText(category)}</span>
          <span className="marketplace-item-condition">Condition: {getConditionText(condition)}</span>
        </div>
        
        <span className={`marketplace-item-status ${getStatusClass(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        
        <div className="marketplace-item-seller">
          <small>Listed on {formatDate(date)}</small>
        </div>
        
        <Link to={`/marketplace/${_id}`} className="btn btn-primary btn-sm mt-1">
          View Details
        </Link>
      </div>
    </div>
  );
};

MarketplaceItemCard.propTypes = {
  item: PropTypes.object.isRequired
};

export default MarketplaceItemCard;
