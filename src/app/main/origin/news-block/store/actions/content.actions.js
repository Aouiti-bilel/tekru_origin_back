import { contentService } from 'app/services/originServices';

export const GET_CONTENTS = '[CMS] GET CONTENTS';
export const OPEN_CONTENT_DIALOG = '[CMS] OPEN CONTENT DIALOG';
export const CLOSE_CONTENT_DIALOG = '[CMS] CLOSE CONTENT DIALOG';
export const ADD_CONTENT = '[CMS] ADD CONTENT';
export const UPDATE_CONTENT = '[CMS] UPDATE CONTENT';
export const DELETE_CONTENT = '[CMS] DELETE CONTENT';
export const SET_DISPLAY_TYPE = '[CMS] SET DISPLAY TYPE';

export function getContents() {
    return (dispatch, getState) => {
        const { newsBlockApp } = getState();
        if (!newsBlockApp.data || newsBlockApp.data.length < 1) {
            contentService.getAll()
                .then((response) => {
                    dispatch({
                        type: GET_CONTENTS,
                        payload: response
                    })
                })
                .catch(error => {
                    //console.log(error);
                });
        } else {
            dispatch({
                type: GET_CONTENTS,
                payload: newsBlockApp.data
            })
        }
    }
}

export function getContentText(id) {
    return (dispatch) => 
        contentService.getContentText(id)
        .then((response) => {
            dispatch({
                type: UPDATE_CONTENT,
                payload: {
                    id,
                    response
                }
            })
        })
        .catch(error => {
            //console.log(error);
        });
}

export function addContent(data, keepEditing=true) {
    return {
        type: ADD_CONTENT,
        payload: {
            data,
            keepEditing
        }
    }
}

export function deleteContent(id) {
    return (dispatch) => 
        contentService.delete(id)
        .then((response) => {
            dispatch({
                type: DELETE_CONTENT,
                payload: id
            })
        })
        .catch(error => {
            //console.log(error);
        });
}

export function updateContent(id, data, element) {
    return {
        type: UPDATE_CONTENT,
        payload: {
            id,
            response: data,
            element
        }
    }
}

export function setDisplayType(type) {
    return {
        type: SET_DISPLAY_TYPE,
        payload: type
    }
}