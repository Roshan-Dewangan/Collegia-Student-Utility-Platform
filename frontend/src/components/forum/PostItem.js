import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, title, name, user, likes, comments, date, category, tags },
  showActions
}) => {
  const formatDate = date => {
    return new Date(date).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-meta">
          <img
            src={`https://gravatar.com/avatar/${_id}?d=mm&r=pg&s=50`}
            alt="User"
          />
          <div>
            <h4>{name}</h4>
            <small className="post-date">{formatDate(date)}</small>
          </div>
        </div>
        <span className="post-category">{category}</span>
      </div>
      <h3 className="post-title">{title}</h3>
      <p className="post-content">{truncateText(text)}</p>
      
      {tags && tags.length > 0 && (
        <div className="post-tags">
          {tags.map((tag, index) => (
            <span key={index} className="post-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {showActions && (
        <div className="post-actions">
          <div>
            <button
              onClick={() => addLike(_id)}
              type="button"
              className="post-action-btn"
            >
              <i className="fas fa-thumbs-up"></i>{' '}
              <span>{likes.length > 0 && likes.length}</span>
            </button>
            <button
              onClick={() => removeLike(_id)}
              type="button"
              className="post-action-btn"
            >
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/forum/${_id}`} className="post-action-btn">
              <i className="fas fa-comment"></i>{' '}
              <span>{comments.length > 0 && comments.length}</span>
            </Link>
          </div>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={() => deletePost(_id)}
              type="button"
              className="post-action-btn"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
