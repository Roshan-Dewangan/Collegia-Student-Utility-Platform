import {
  GET_MARKETPLACE_ITEMS,
  GET_MARKETPLACE_ITEM,
  MARKETPLACE_ERROR,
  ADD_MARKETPLACE_ITEM,
  DELETE_MARKETPLACE_ITEM,
  UPDATE_MARKETPLACE_ITEM
} from '../actions/types';

const initialState = {
  items: [],
  item: null,
  loading: true,
  error: {}
};

const marketplaceReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MARKETPLACE_ITEMS:
      return {
        ...state,
        items: payload,
        loading: false
      };
    case GET_MARKETPLACE_ITEM:
      return {
        ...state,
        item: payload,
        loading: false
      };
    case ADD_MARKETPLACE_ITEM:
      return {
        ...state,
        items: [payload, ...state.items],
        loading: false
      };
    case DELETE_MARKETPLACE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item._id !== payload),
        loading: false
      };
    case UPDATE_MARKETPLACE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === payload._id ? payload : item
        ),
        item: payload,
        loading: false
      };
    case MARKETPLACE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default marketplaceReducer;
