import {
  GET_EVENTS,
  GET_EVENT,
  EVENT_ERROR,
  ADD_EVENT,
  DELETE_EVENT,
  UPDATE_ATTENDEES
} from '../actions/types';

const initialState = {
  events: [],
  event: null,
  loading: true,
  error: {}
};

const eventReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_EVENTS:
      return {
        ...state,
        events: payload,
        loading: false
      };
    case GET_EVENT:
      return {
        ...state,
        event: payload,
        loading: false
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [payload, ...state.events],
        loading: false
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event._id !== payload),
        loading: false
      };
    case UPDATE_ATTENDEES:
      return {
        ...state,
        event: {
          ...state.event,
          attendees: payload
        },
        events: state.events.map(event =>
          event._id === state.event._id
            ? { ...event, attendees: payload }
            : event
        ),
        loading: false
      };
    case EVENT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default eventReducer;
