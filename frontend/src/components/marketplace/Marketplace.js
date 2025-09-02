import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMarketplaceItems } from '../../actions/marketplace';
import Spinner from '../layout/Spinner';
import MarketplaceItemCard from './MarketplaceItemCard';

const Marketplace = ({
  getMarketplaceItems,
  marketplace: { items, loading }
}) => {
  useEffect(() => {
    getMarketplaceItems();
  }, [getMarketplaceItems]);

  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priceRange: 'all'
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filterItems = (items) => {
    return items.filter(item => {
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }
      
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      
      if (filters.priceRange !== 'all') {
        const price = Number(item.price);
        if (filters.priceRange === 'under500' && price >= 500) {
          return false;
        } else if (filters.priceRange === '500to1000' && (price < 500 || price > 1000)) {
          return false;
        } else if (filters.priceRange === '1000to5000' && (price < 1000 || price > 5000)) {
          return false;
        } else if (filters.priceRange === 'above5000' && price <= 5000) {
          return false;
        }
      }
      
      return true;
    });
  };

  const filteredItems = loading ? [] : filterItems(items);

  return loading ? (
    <Spinner />
  ) : (
    <div className="marketplace-container">
      <h1 className="large text-primary">Marketplace</h1>
      <p className="lead">
        <i className="fas fa-shopping-cart"></i> Buy and sell items within the campus
      </p>
      
      <div className="marketplace-header">
        <Link to="/marketplace/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> List New Item
        </Link>
      </div>
      
      <div className="marketplace-filters">
        <div className="form-group">
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            <option value="book">Books</option>
            <option value="equipment">Equipment</option>
            <option value="others">Others</option>
          </select>
        </div>
        
        <div className="form-group">
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        
        <div className="form-group">
          <select 
            name="priceRange" 
            value={filters.priceRange} 
            onChange={handleFilterChange}
          >
            <option value="all">All Prices</option>
            <option value="under500">Under ₹500</option>
            <option value="500to1000">₹500 - ₹1000</option>
            <option value="1000to5000">₹1000 - ₹5000</option>
            <option value="above5000">Above ₹5000</option>
          </select>
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="marketplace-grid">
          {filteredItems.map(item => (
            <MarketplaceItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="no-items">
          <p>No items found. Adjust your filters or add a new listing.</p>
        </div>
      )}
    </div>
  );
};

Marketplace.propTypes = {
  getMarketplaceItems: PropTypes.func.isRequired,
  marketplace: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  marketplace: state.marketplace
});

export default connect(mapStateToProps, { getMarketplaceItems })(Marketplace);
