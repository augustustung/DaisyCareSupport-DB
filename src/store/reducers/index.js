import { combineReducers } from 'redux';

import conversationState from './conversations';
import messagesState from './messages';
import userState from './user';

export default combineReducers({
  conversationState,
  messagesState,
  userState
});