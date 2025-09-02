import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, updateProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const UpdateProfile = ({
  getCurrentProfile,
  updateProfile,
  profile: { profile, loading },
  auth: { user }
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  
  const [formData, setFormData] = useState({
    skills: '',
    achievements: '',
    github: '',
    linkedin: '',
    website: '',
    projects: []
  });
  
  useEffect(() => {
    if (!loading && profile) {
      setFormData({
        skills: profile.skills ? profile.skills.join(', ') : '',
        achievements: profile.achievements ? profile.achievements.join(', ') : '',
        github: profile.socialLinks ? profile.socialLinks.github || '' : '',
        linkedin: profile.socialLinks ? profile.socialLinks.linkedin || '' : '',
        website: profile.socialLinks ? profile.socialLinks.website || '' : '',
        projects: profile.projects || []
      });
    }
  }, [loading, profile]);
  
  const { skills, achievements, github, linkedin, website, projects } = formData;
  
  const onChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    link: ''
  });
  
  const { title, description, link } = projectData;
  
  const onProjectDataChange = e => 
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  
  const addProject = e => {
    e.preventDefault();
    setFormData({
      ...formData,
      projects: [...projects, projectData]
    });
    setProjectData({
      title: '',
      description: '',
      link: ''
    });
  };
  
  const removeProject = index => {
    setFormData({
      ...formData,
      projects: projects.filter((_, i) => i !== index)
    });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    const profileData = {
      skills: skills.split(',').map(skill => skill.trim()),
      achievements: achievements.split(',').map(achievement => achievement.trim()),
      socialLinks: {
        github,
        linkedin,
        website
      },
      projects
    };
    
    updateProfile(profileData, navigate);
  };
  
  return loading ? (
    <Spinner />
  ) : (
    <div className="container profile-form-container">
      <h1 className="large text-primary">Update Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user-circle"></i> Add information to make your profile stand out
      </p>
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <h4>Skills</h4>
          <input
            type="text"
            placeholder="Skills (comma separated)"
            name="skills"
            value={skills}
            onChange={onChange}
          />
          <small>e.g. JavaScript, React, Node.js, Java</small>
        </div>
        
        <div className="form-group">
          <h4>Achievements</h4>
          <input
            type="text"
            placeholder="Achievements (comma separated)"
            name="achievements"
            value={achievements}
            onChange={onChange}
          />
          <small>e.g. First place in coding competition, Dean's list</small>
        </div>
        
        <div className="form-group">
          <h4>Social Links</h4>
          <div className="social-inputs">
            <div className="form-group social-input">
              <i className="fab fa-github fa-2x"></i>
              <input
                type="text"
                placeholder="GitHub URL"
                name="github"
                value={github}
                onChange={onChange}
              />
            </div>
            
            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <input
                type="text"
                placeholder="LinkedIn URL"
                name="linkedin"
                value={linkedin}
                onChange={onChange}
              />
            </div>
            
            <div className="form-group social-input">
              <i className="fas fa-globe fa-2x"></i>
              <input
                type="text"
                placeholder="Website URL"
                name="website"
                value={website}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <h4>Projects</h4>
          
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                {project.link && <p><a href={project.link} target="_blank" rel="noopener noreferrer">Project Link</a></p>}
                <button 
                  type="button" 
                  onClick={() => removeProject(index)} 
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-project">
            <h5>Add New Project</h5>
            <div className="form-group">
              <input
                type="text"
                placeholder="Project Title"
                name="title"
                value={title}
                onChange={onProjectDataChange}
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Project Description"
                name="description"
                value={description}
                onChange={onProjectDataChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Project Link"
                name="link"
                value={link}
                onChange={onProjectDataChange}
              />
            </div>
            <button 
              type="button" 
              onClick={addProject} 
              className="btn btn-light"
              disabled={!title || !description}
            >
              Add Project
            </button>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Update Profile</button>
          <Link to="/dashboard" className="btn btn-light">Go Back</Link>
        </div>
      </form>
    </div>
  );
};

UpdateProfile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, updateProfile })(UpdateProfile);
