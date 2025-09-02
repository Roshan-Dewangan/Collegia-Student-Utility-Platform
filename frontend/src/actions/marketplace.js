import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_MARKETPLACE_ITEMS,
  GET_MARKETPLACE_ITEM,
  MARKETPLACE_ERROR,
  ADD_MARKETPLACE_ITEM,
  DELETE_MARKETPLACE_ITEM,
  UPDATE_MARKETPLACE_ITEM
} from './types';

export const getMarketplaceItems = () => async dispatch => {
  try {
    const res = await axios.get('/api/marketplace');

    dispatch({
      type: GET_MARKETPLACE_ITEMS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MARKETPLACE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const getMarketplaceItem = id => async dispatch => {
  try {
    const res = await axios.get(`/api/marketplace/${id}`);

    dispatch({
      type: GET_MARKETPLACE_ITEM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: MARKETPLACE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const createMarketplaceItem = (formData, navigate) => async dispatch => {
  try {
    const res = await axios.post('/api/marketplace', formData);

    dispatch({
      type: ADD_MARKETPLACE_ITEM,
      payload: res.data
    });

    dispatch(setAlert('Item Listed Successfully', 'success'));
    navigate('/marketplace');
  } catch (err) {
    dispatch({
      type: MARKETPLACE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const updateMarketplaceItem = (id, formData) => async dispatch => {
  try {
    const res = await axios.put(`/api/marketplace/${id}`, formData);

    dispatch({
      type: UPDATE_MARKETPLACE_ITEM,
      payload: res.data
    });

    dispatch(setAlert('Item Updated', 'success'));
  } catch (err) {
    dispatch({
      type: MARKETPLACE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

export const deleteMarketplaceItem = id => async dispatch => {
  try {
    await axios.delete(`/api/marketplace/${id}`);

    dispatch({
      type: DELETE_MARKETPLACE_ITEM,
      payload: id
    });

    dispatch(setAlert('Item Removed', 'success'));
  } catch (err) {
    dispatch({
      type: MARKETPLACE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};
