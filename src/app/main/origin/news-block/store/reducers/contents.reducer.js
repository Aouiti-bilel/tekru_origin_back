import * as Actions from '../actions';
import excerptHelper from '../../libs/excerpt.helper';
import { DEFAULT_DISPLAY_TYPE } from '../../ContentConst';

const initialState = {
    data: null,
    edit: false,
    categories: [],
    displayType: DEFAULT_DISPLAY_TYPE,
};

const cmsReducer = function (state = initialState, action) {
    switch ( action.type ) {
        case Actions.GET_CONTENTS: {
            return {
                ...state,
                data: action.payload
            };
        }
        case Actions.ADD_CONTENT: {
            action.payload.data.excerpt = excerptHelper(action.payload.data.content);
            return {
                ...state,
                data: [
                    action.payload.data,
                    ...state.data,
                ],
            };
        }
        case Actions.UPDATE_CONTENT: {
            let {
                id,
                response,
                element
            } = action.payload
            // if element is not null
            if (element === undefined || element === null) {
                element = 'content';
            }
            return {
                ...state,
                data: state.data.map((item, index) => {
                    if (item.id === id) {
                        const tmp = {
                            ...item,
                            [element]: response,
                        }
                        if (element === 'content') {
                            tmp.excerpt = excerptHelper(response);
                        }
                        return tmp;
                    }
                    return item
                })
            };
        }
        case Actions.DELETE_CONTENT: {
            return {
                ...state,
                data: [...state.data.filter(item => item.id !== action.payload)]
            };
        }
        case Actions.OPEN_CONTENT_DIALOG: {
            return {
                ...state,
                edit: action.payload.edit
            };
        }
        case Actions.CLOSE_CONTENT_DIALOG: {
            return {
                ...state,
                edit: false,
            };
        }
        case Actions.SET_DISPLAY_TYPE: {
            return {
                ...state,
                displayType: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
};

export default cmsReducer;
