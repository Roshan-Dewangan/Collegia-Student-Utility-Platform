import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';
import marketplace from './marketplace';
import resource from './resource';
import event from './event';

export default combineReducers({
  alert,
  auth,
  profile,
  post,
  marketplace,
  resource,
  event
});
