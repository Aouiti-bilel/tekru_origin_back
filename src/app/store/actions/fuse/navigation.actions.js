import {FuseUtils} from '@fuse';
import menuService from 'app/services/originServices/menusService';

export const GET_NAVIGATION = '[NAVIGATION] GET NAVIGATION';
export const SET_NAVIGATION = '[NAVIGATION] SET NAVIGATION';
export const RESET_NAVIGATION = '[NAVIGATION] RESET NAVIGATION';

export function setNavigation() {
    return async (dispatch, getState) => {
        const {
            fuse
        } = getState();
        if (menuService.getAccessToken() && (!fuse.navigation || fuse.navigation.length < 1)) {
            await menuService.get()
                .then((response) => {
                    dispatch({
                        type: SET_NAVIGATION,
                        payload: response
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            dispatch({
                type: SET_NAVIGATION,
                payload: fuse.navigation
            })
        }
    }
}

export function updateNavigation(menu) {
    return {
        type: SET_NAVIGATION,
        payload: menu
    }
}

export function resetNavigation() {
    return async (dispatch) => {
        const accessToken = menuService.getAccessToken();
        if (accessToken) {
            await menuService.get()
                .then((response) => {
                    dispatch({
                        type: RESET_NAVIGATION,
                        payload: response
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            dispatch({
                type: RESET_NAVIGATION,
                payload: null
            })
        }
    }
}

export function appendNavigationItem(item, parentId)
{
    return (dispatch, getState) => {
        const {navigation} = getState().fuse;
        return dispatch({
            type      : SET_NAVIGATION,
            navigation: FuseUtils.appendNavItem(navigation, item, parentId)
        });
    }
}

export function prependNavigationItem(item, parentId)
{
    return (dispatch, getState) => {
        const {navigation} = getState().fuse;
        return dispatch({
            type      : SET_NAVIGATION,
            navigation: FuseUtils.prependNavItem(navigation, item, parentId)
        });
    }
}

export function updateNavigationItem(id, item)
{
    return (dispatch, getState) => {
        const {navigation} = getState().fuse;
        return dispatch({
            type      : SET_NAVIGATION,
            navigation: FuseUtils.updateNavItem(navigation, id, item)
        });
    }
}

export function removeNavigationItem(id)
{
    return (dispatch, getState) => {
        const {navigation} = getState().fuse;
        return dispatch({
            type      : SET_NAVIGATION,
            navigation: FuseUtils.removeNavItem(navigation, id)
        });
    }
}
