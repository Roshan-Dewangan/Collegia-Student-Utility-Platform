import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment, upvoteComment } from '../../actions/post';

const CommentItem = ({
  deleteComment,
  upvoteComment,
  postId,
  comment: { _id, text, name, user, date, upvotes },
  auth
}) => {
  const formatDate = date => {
    return new Date(date).toLocaleDateString();
  };

  const isUpvoted = upvotes.some(upvote => upvote.user === auth.user._id);

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-meta">
          <img
            src={`https://gravatar.com/avatar/${_id}?d=mm&r=pg&s=40`}
            alt="User"
          />
          <div>
            <h4>{name}</h4>
            <small className="comment-date">{formatDate(date)}</small>
          </div>
        </div>
      </div>
      <p className="comment-text">{text}</p>
      <div className="comment-actions">
        <button 
          onClick={() => upvoteComment(_id)} 
          className={`comment-action-btn ${isUpvoted ? 'upvoted' : ''}`}
        >
          <i className="fas fa-arrow-up"></i>{' '}
          <span>{upvotes.length > 0 && upvotes.length}</span>
        </button>
        
        {!auth.loading && user === auth.user._id && (
          <button
            onClick={() => deleteComment(_id)}
            type="button"
            className="comment-action-btn"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  upvoteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deleteComment, upvoteComment })(
  CommentItem
);
