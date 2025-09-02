import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_EVENTS,
  GET_EVENT,
  EVENT_ERROR,
  ADD_EVENT,
  DELETE_EVENT,
  UPDATE_ATTENDEES
} from './types';

export const getEvents = () => async dispatch => {
  try {
    const res = await axios.get('/api/events');

    dispatch({
      type: GET_EVENTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getEvent = id => async dispatch => {
  try {
    const res = await axios.get(`/api/events/${id}`);

    dispatch({
      type: GET_EVENT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createEvent = (formData, history) => async dispatch => {
  try {
    const res = await axios.post('/api/events', formData);

    dispatch({
      type: ADD_EVENT,
      payload: res.data
    });

    dispatch(setAlert('Event Created Successfully', 'success'));
    history('/events');
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const toggleAttendance = id => async dispatch => {
  try {
    const res = await axios.put(`/api/events/attend/${id}`);

    dispatch({
      type: UPDATE_ATTENDEES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteEvent = id => async dispatch => {
  try {
    await axios.delete(`/api/events/${id}`);

    dispatch({
      type: DELETE_EVENT,
      payload: id
    });

    dispatch(setAlert('Event Removed', 'success'));
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
