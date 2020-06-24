import {combineReducers} from 'redux';
import user from './user.reducer';
import login from './login.reducer';
import register from './register.reducer';
import forgetpassword from './forgetpassword.reducer';
import resetpassword from './resetpassword.reducer';
import editpassword from './editpassword.reducer';

const authReducers = combineReducers({
    user,
    login,
    register,
    forgetpassword,
    resetpassword,
    editpassword
});

export default authReducers;