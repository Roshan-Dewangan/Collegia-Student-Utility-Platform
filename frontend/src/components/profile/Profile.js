import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProfileById } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Profile = ({ getProfileById, profile: { profile, loading }, auth }) => {
  const { id } = useParams();
  
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);
  
  if (loading || profile === null) {
    return <Spinner />;
  }
  
  const {
    name,
    role,
    department,
    semester,
    skills,
    achievements,
    projects,
    socialLinks,
    profilePicture,
    date
  } = profile;
  
  const isCurrentUser = auth.user && auth.user._id === id;
  
  return (
    <div className="profile-container">
      <Link to="/dashboard" className="btn btn-light">
        Back To Dashboard
      </Link>
      
      <div className="profile-header">
        <img
          className="profile-avatar"
          src={profilePicture || `https://gravatar.com/avatar/${id}?d=mm&r=pg&s=200`}
          alt={name}
        />
        
        <div className="profile-info">
          <h2>{name}</h2>
          <p className="profile-role">{role}</p>
          
          <div className="profile-details">
            <p><i className="fas fa-university"></i> {department}</p>
            {role === 'student' && <p><i className="fas fa-graduation-cap"></i> Semester {semester}</p>}
            <p><i className="fas fa-calendar-alt"></i> Joined {new Date(date).toLocaleDateString()}</p>
          </div>
          
          {socialLinks && (
            <div className="profile-social">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
              )}
              {socialLinks.website && (
                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-globe"></i>
                </a>
              )}
            </div>
          )}
          
          {isCurrentUser && (
            <div className="profile-actions">
              <Link to="/profile/update" className="btn btn-primary">
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {skills && skills.length > 0 && (
        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skill-tags">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}
      
      {achievements && achievements.length > 0 && (
        <div className="profile-section">
          <h3>Achievements</h3>
          <div className="achievements-list">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {projects && projects.length > 0 && (
        <div className="profile-section">
          <h3>Projects</h3>
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h4 className="project-title">{project.title}</h4>
                <p>{project.description}</p>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link"
                  >
                    View Project <i className="fas fa-external-link-alt"></i>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);
