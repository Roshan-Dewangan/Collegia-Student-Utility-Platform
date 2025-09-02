import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts, addPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';

const Forum = ({ 
  getPosts, 
  addPost, 
  post: { posts, loading },
  auth: { user }
}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'discussion',
    tags: ''
  });

  const { title, text, category, tags } = formData;

  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim());
    addPost({ ...formData, tags: tagsArray });
    setFormData({
      title: '',
      text: '',
      category: 'discussion',
      tags: ''
    });
  };

  const [filter, setFilter] = useState('all');

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  return loading ? (
    <Spinner />
  ) : (
    <div className="forum-container">
      <h1 className="large text-primary">Forum</h1>
      <p className="lead">
        <i className="fas fa-comments"></i> Share your questions and insights
      </p>

      <div className="post-form">
        <h2>Start a Discussion</h2>
        <form onSubmit={onSubmit}>
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
              placeholder="What's on your mind?"
              name="text"
              value={text}
              onChange={onChange}
              rows="5"
              required
            ></textarea>
          </div>
          <div className="form-group">
            <select name="category" value={category} onChange={onChange}>
              <option value="discussion">General Discussion</option>
              <option value="question">Question</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Tags (comma separated)"
              name="tags"
              value={tags}
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <div className="filter-buttons my-1">
        <button 
          onClick={() => setFilter('all')} 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-light'}`}
        >
          All Posts
        </button>
        <button 
          onClick={() => setFilter('discussion')} 
          className={`btn ${filter === 'discussion' ? 'btn-primary' : 'btn-light'}`}
        >
          Discussions
        </button>
        <button 
          onClick={() => setFilter('question')} 
          className={`btn ${filter === 'question' ? 'btn-primary' : 'btn-light'}`}
        >
          Questions
        </button>
        <button 
          onClick={() => setFilter('announcement')} 
          className={`btn ${filter === 'announcement' ? 'btn-primary' : 'btn-light'}`}
        >
          Announcements
        </button>
      </div>

      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostItem key={post._id} post={post} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

Forum.propTypes = {
  getPosts: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, { getPosts, addPost })(Forum);
