import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPost, addComment } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import CommentItem from './CommentItem';

const Post = ({ getPost, addComment, post: { post, loading }, auth }) => {
  const { id } = useParams();

  useEffect(() => {
    getPost(id);
  }, [getPost, id]);

  const [text, setText] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    addComment(id, { text });
    setText('');
  };

  return loading || post === null ? (
    <Spinner />
  ) : (
    <div className="post-detail-container">
      <Link to="/forum" className="btn btn-light">
        Back To Forum
      </Link>
      
      <div className="post-detail">
        <PostItem post={post} showActions={false} />
      </div>
      
      <div className="comment-section">
        <div className="comment-form">
          <h3>Leave a Comment</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <textarea
                name="text"
                cols="30"
                rows="5"
                placeholder="Add your comment"
                value={text}
                onChange={e => setText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
        
        <div className="comments">
          <h3 className="comments-title">Comments ({post.comments.length})</h3>
          <div className="comment-list">
            {post.comments.map(comment => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                postId={post._id} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { getPost, addComment })(Post);
