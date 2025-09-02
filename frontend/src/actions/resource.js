import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_RESOURCES,
  GET_RESOURCE,
  RESOURCE_ERROR,
  ADD_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE_DOWNLOADS
} from './types';

export const getResources = () => async dispatch => {
  try {
    const res = await axios.get('/api/resources');

    dispatch({
      type: GET_RESOURCES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RESOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getFilteredResources = (filterParams) => async dispatch => {
  try {
    const res = await axios.get('/api/resources/filter', { params: filterParams });

    dispatch({
      type: GET_RESOURCES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RESOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getResource = id => async dispatch => {
  try {
    const res = await axios.get(`/api/resources/${id}`);

    dispatch({
      type: GET_RESOURCE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RESOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const uploadResource = (formData, history) => async dispatch => {
  try {
    const res = await axios.post('/api/resources', formData);

    dispatch({
      type: ADD_RESOURCE,
      payload: res.data
    });

    dispatch(setAlert('Resource Uploaded Successfully', 'success'));
    history('/resources');
  } catch (err) {
    dispatch({
      type: RESOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const downloadResource = id => async dispatch => {
  try {
    const res = await axios.put(`/api/resources/download/${id}`);

    dispatch({
      type: UPDATE_RESOURCE_DOWNLOADS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: RESOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteResource = id => async dispatch => {
  try {
    await axios.delete(`/api/resources/${id}`);

    dispatch({
      type: DELETE_RESOURCE,
      payload: id
    });

    dispatch(setAlert('Resource Removed', 'success'));
  } catch (err) {
    dispatch({
      type: RESOURCE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
