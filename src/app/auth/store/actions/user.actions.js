import history from '@history';
import {
    //setDefaultSettings,
    setInitialSettings
} from 'app/store/actions/fuse';
import _ from '@lodash';
import store from 'app/store';
import * as Actions from 'app/store/actions';
import { jwtService } from 'app/services/originServices';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';
export const EDIT_PASSWORD_SUCCESS = '[USER] EDIT PASSWORD SUCCESS';
export const EDIT_PASSWORD_ERROR = '[USER] EDIT PASSWORD ERROR';
export const SET_USER_PROFILE_PICTURE = '[USER] Update user profile picture';
export const UPDATE_USER_ACCESSES = '[USER] Update user accesses';

/**
 * Set User Data
 */
export function setUserData(user) {
    return (dispatch) => {
        /**
         * Set User Settings
         * Render the Origin Apollo data to the template
         */
        const tempAccess = {}
        user.accesses.forEach(access => {
            tempAccess[access.slug] = access;
        });
        const userdata = {
            role: tempAccess,
            data: {
                displayName: user.prenom+' '+user.nomFamille,
                firstName: user.prenom,
                lastName: user.nomFamille,
                photoURL: user.picture,
                email: user.courriel,
                level: {
                    id: user.niveau.niveau,
                    name: user.niveau.description,
                }
                //settings   : (tokenData.user_metadata && tokenData.user_metadata.settings) ? tokenData.user_metadata.settings : {},
                //shortcuts  : (tokenData.user_metadata && tokenData.user_metadata.shortcuts) ? tokenData.user_metadata.shortcuts : []
            }
        };

        /*
        Set User Data
         */
        dispatch({
            type   : SET_USER_DATA,
            payload: userdata
        })
    }
}

/**
 * Update user accesses in the store
 */
export function updateAccesses(accesses) {
    const tempAccess = {}
    accesses.forEach(access => {
        tempAccess[access.slug] = access;
    });
    return {
        type: UPDATE_USER_ACCESSES,
        payload: tempAccess
    }
}

/**
 * Update user profile picture
 */
export function updateUserProfilePicture(profilePicture) {
    return (dispatch, getState) => {
        const user = getState().auth.user;
        user.data.photoURL = profilePicture;
        // Set User Data
        dispatch({
            type: SET_USER_DATA,
            payload: user
        })
    }
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings)
{
    return (dispatch, getState) => {
        const oldUser = getState().auth.user;
        const user = _.merge({}, oldUser, {data: {settings}});

        updateUserData(user);

        return dispatch(setUserData(user));
    }
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts)
{
    return (dispatch, getState) => {
        const user = getState().auth.user;
        const newUser = {
            ...user,
            data: {
                ...user.data,
                shortcuts
            }
        };

        updateUserData(newUser);

        return dispatch(setUserData(newUser));
    }
}

/**
 * Remove User Data
 */
export function removeUserData()
{
    return {
        type: REMOVE_USER_DATA
    }
}

/**
 * Logout
 */
export function logoutUser()
{

    return (dispatch, getState) => {

        const user = getState().auth.user;

        if ( !user.role || user.role.length === 0 )// is guest
        {
            return null;
        }

        history.push({
            pathname: '/'
        });

        jwtService.logout();

        dispatch(setInitialSettings());

        dispatch({
            type: USER_LOGGED_OUT
        })
    }
}

/**
 * Update User Data
 */
function updateUserData(user)
{
    if ( !user.role || user.role.length === 0 )// is guest
    {
        return;
    }

    jwtService.updateUserData(user)
        .then(() => {
            store.dispatch(Actions.showMessage({
                message: "User data saved with api"
            }));
        })
        .catch(error => {
            store.dispatch(Actions.showMessage({
                message: error.message
            }));
        });
}

/**
 * Edit the user password
 */
export function editPassword({
    oldpassword,
    password,
    password2
}) {
    return (dispatch) =>
        jwtService.editPassword(oldpassword, password, password2)
        .then((action) => {
            return dispatch({
                type: EDIT_PASSWORD_SUCCESS,
                payload: action
            });
        })
        .catch(error => {
            return dispatch({
                type: EDIT_PASSWORD_ERROR,
                payload: error
            });
        });
}
