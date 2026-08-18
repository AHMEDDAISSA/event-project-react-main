import {combineReducers} from 'redux';
import ApplicationReducer from './application';
import registerDataReducer from './registerDataSlice';
import AuthReducer from './authSlice';
import resetPasswordReducer from './resetPasswordSlice';
import contactsReducer from './contactsSlice';

export default combineReducers({
  application: ApplicationReducer,
  auth: AuthReducer,
  registerData: registerDataReducer,
  resetPassword: resetPasswordReducer,
  contacts: contactsReducer,
});
