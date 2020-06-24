import * as Actions from './actions';

const initialState = {
    data: null,
    editableItem: null,
    createDialog: false,
    deletedItems: [],
    lastId: 0,
    synced: true,
    categoryDialog: false,
    levels: [],
};

const navMenuAdminReducer = function (state = initialState, action) {
    switch ( action.type ) {
        case Actions.SET_DATA: {
            return {
                ...state,
                data: action.payload
            };
        }
        case Actions.UPDATE_DATA: {
            return {
                ...state,
                synced: false,
                data: action.payload
            };
        }
        case Actions.CREATE_ITEM: {
            return {
                ...state,
                createDialog: true,
            }
        }
        case Actions.CLOSE_CREATING_DIALOG: {
            return {
                ...state,
                createDialog: false,
            }
        }
        case Actions.ADD_ITEM: {
            const item = {
                ...action.payload,
                isNewItem: true,
                id: (state.lastId - 1)
            }
            if (!item.parentId) {
                item.parentId = 0;
            }
            return {
                ...state,
                lastId: (state.lastId - 1),
                synced: false,
                editableItem: item,
                data: [
                    ...state.data,
                    item,
                ],
                createDialog: false,
            };
        }
        case Actions.EDIT_ITEM: {
            return {
                ...state,
                editableItem: action.payload
            };
        }
        case Actions.UPDATE_ITEM: {
            const item = { ...action.payload }
            const index = state.data.findIndex(element => {
                if (item.parent) {
                    return element.id === item.parent;
                } else {
                    return element.id === item.id;
                }
            });

            return {
                ...state,
                synced: false,
                data: state.data.map((e, i) => {
                    if (i === index) {
                        let tmp = { ...e };
                        // if it's a child
                        if (item.parent) {
                            tmp.children = tmp.children.map((child) => {
                                if (child.id === item.id) {
                                    return {
                                        ...child,
                                        ...item,
                                    }
                                } else {
                                    return child;
                                }
                            });
                        } else {
                            tmp = { ...tmp, ...item }
                        }
                        return tmp;
                    }
                    return e;
                }),
                editableItem: {
                    ...state.editableItem,
                    ...item,
                },
            };
        }
        case Actions.DELETE_ITEM: {
            const item = { ...action.payload }
            if (item.parent) {
                return {
                    ...state,
                    synced: false,
                    deletedItems: [...state.deletedItems, item],
                    data: state.data.map((e) => {
                        if (e.id === item.parent) {
                            let tmp = { ...e };
                            tmp.children = tmp.children.filter(child => child.id !== item.id);
                            return tmp;
                        } else {
                            return e;
                        }
                    }),
                    editableItem: null,
                };
            } else {
                return {
                    ...state,
                    synced: false,
                    deletedItems: [...state.deletedItems, item],
                    data: state.data.filter(e => e.id !== item.id),
                    editableItem: null,
                };
            }
        }
        case Actions.SYNC_SERVER: {
            return {
                ...state,
                synced: Boolean(action.payload),
            };
        }
        case Actions.OPEN_CATEGORY_DIALOG: {
            return {
                ...state,
                categoryDialog: true,
            };
        }
        case Actions.CLOSE_CATEGORY_DIALOG: {
            return {
                ...state,
                categoryDialog: false,
            };
        }
        case Actions.SET_LEVELS: {
            return {
                ...state,
                levels: action.payload,
            };
        }
        case Actions.RESET_APP:{
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default navMenuAdminReducer;
