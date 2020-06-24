import { jwtService } from 'app/services/originServices';
import {setUserData} from './user.actions';
import * as Actions from 'app/store/actions';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const FORGET_PASSWORD_SUCCESS = 'FORGET_PASSWORD_SUCCESS';
export const FORGET_PASSWORD_ERROR = 'FORGET_PASSWORD_ERROR';
export const RESET_PASSWORD_SUCCESS = 'FORGET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'FORGET_PASSWORD_ERROR';

export function submitLogin({email, password}) {
    return (dispatch) =>
        jwtService.signInWithEmailAndPassword(email, password)
            .then((user) => {
                dispatch(setUserData(user));
                dispatch(Actions.resetNavigation());
                return dispatch({
                    type: LOGIN_SUCCESS
                });
            } )
            .catch(error => {
                return dispatch({
                    type   : LOGIN_ERROR,
                    payload: error
                });
            });
}

export function forgetPassword({email}) {
    return (dispatch) =>
        jwtService.forgetPassword(email)
            .then((action) => {
                return dispatch({
                    type: FORGET_PASSWORD_SUCCESS,
                    payload: email
                });
            })
            .catch(error => {
                return dispatch({
                    type: FORGET_PASSWORD_ERROR,
                    payload: error
                });
            });
}

export function resetPassword({ token, password }) {
    return (dispatch) =>
        jwtService.resetPassword(token, password)
        .then((action) => {
            return dispatch({
                type: RESET_PASSWORD_SUCCESS,
                payload: action
            });
        })
        .catch(error => {
            return dispatch({
                type: RESET_PASSWORD_ERROR,
                payload: error
            });
        });
}