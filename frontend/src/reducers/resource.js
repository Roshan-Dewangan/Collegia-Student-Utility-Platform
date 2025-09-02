import {
  GET_RESOURCES,
  GET_RESOURCE,
  RESOURCE_ERROR,
  ADD_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE_DOWNLOADS
} from '../actions/types';

const initialState = {
  resources: [],
  resource: null,
  loading: true,
  error: {}
};

const resourceReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_RESOURCES:
      return {
        ...state,
        resources: payload,
        loading: false
      };
    case GET_RESOURCE:
      return {
        ...state,
        resource: payload,
        loading: false
      };
    case ADD_RESOURCE:
      return {
        ...state,
        resources: [payload, ...state.resources],
        loading: false
      };
    case DELETE_RESOURCE:
      return {
        ...state,
        resources: state.resources.filter(resource => resource._id !== payload),
        loading: false
      };
    case UPDATE_RESOURCE_DOWNLOADS:
      return {
        ...state,
        resources: state.resources.map(resource =>
          resource._id === payload._id ? payload : resource
        ),
        resource: payload,
        loading: false
      };
    case RESOURCE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default resourceReducer;
