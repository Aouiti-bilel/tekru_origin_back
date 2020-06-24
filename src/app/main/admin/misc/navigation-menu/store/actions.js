export const SET_DATA = '[NavMenu-ADMIN] SET DATA';
export const UPDATE_DATA = '[NavMenu-ADMIN] UPDATE DATA BULK';
export const CREATE_ITEM = '[NavMenu-ADMIN] CREATE ITEM';
export const CLOSE_CREATING_DIALOG = '[NavMenu-ADMIN] CLOSE DIALOG';
export const ADD_ITEM = '[NavMenu-ADMIN] ADD ITEM';
export const EDIT_ITEM = '[NavMenu-ADMIN] EDIT ITEM';
export const UPDATE_ITEM = '[NavMenu-ADMIN] UPDATE ITEM';
export const DELETE_ITEM = '[NavMenu-ADMIN] DELETE ITEM';
export const SYNC_SERVER = '[NavMenu-ADMIN] UPDATE SYNCing STATUS';
export const OPEN_CATEGORY_DIALOG = '[NavMenu-ADMIN] OPEN CATEGORY DIALOG';
export const CLOSE_CATEGORY_DIALOG = '[NavMenu-ADMIN] CLOSE CATEGORY DIALOG';
export const SET_LEVELS = '[NavMenu-ADMIN] SET THE LEVELS';
export const RESET_APP = '[NavMenu-ADMIN] RESET APP';

export function setData(data) {
    if (!data) {
        data = [];
    }
    return {
        type: SET_DATA,
        payload: data
    }
}

export function resetApp() {
    return {
        type: RESET_APP,
    }
}

export function updateData(data) {
    if (!data) {
        data = [];
    }
    return {
        type: UPDATE_DATA,
        payload: data
    }
}

export function createItem() {
    return {
        type: CREATE_ITEM
    }
}

export function closeDialog() {
    return {
        type: CLOSE_CREATING_DIALOG
    }
}

export function addItem(item) {
    if (!item) {
        return {};
    }
    return {
        type: ADD_ITEM,
        payload: item
    }
}

export function editItem(element) {
    if (!element) {
        return {};
    }
    return {
        type: EDIT_ITEM,
        payload: element
    }
}

export function updateItem(element) {
    if (!element) {
        return {};
    }
    return {
        type: UPDATE_ITEM,
        payload: element
    }
}

export function deleteItem(element) {
    if (!element) {
        return {};
    }
    return {
        type: DELETE_ITEM,
        payload: element
    }
}

export function syncServer(state) {
    state = Boolean(state);
    return {
        type: SYNC_SERVER,
        payload: state
    }
}

export function openCategoryDialog(item) {
    return {
        type: OPEN_CATEGORY_DIALOG,
    }
}

export function closeCategoryDialog() {
    return {
        type: CLOSE_CATEGORY_DIALOG,
    }
}

export function setLevels(data) {
    return {
        type: SET_LEVELS,
        payload: data
    }
}