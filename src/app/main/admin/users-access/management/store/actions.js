export const SET_USERS = "[UserManager] Set users";

export const RESET_USER_FORM = '[UserManager] Reset user form';
export const ADD_USER = '[UserManager] Add user to state';
export const EDIT_USER = '[UserManager] Edit a selected user';
export const UPDATE_USER = '[UserManager] Update user in state';
export const DELETE_USER = "[UserManager] Delete user";
export const TOGGLE_USER_ACTIVATION = "[UserManager] Toggle user activation";

export const SET_SEARCH_WORD = '[UserManager] SET SEARCH WORD';
export const SET_COUNTRIES = '[UserManager] SET COUNTRIES'
export const SET_CITIES = '[UserManager] SET CITIES'
export const SET_REGIONS = '[UserManager] SET REGIONS'
export const SET_WEEKLY_HOURS = '[UserManager] Setting weekly hours variable'
export const SET_STANDARD_COMMISSION = '[UserManager] Setting standard commission variable'

export const SET_USERS_LEVELS = '[UserManager] Set users levels';
export const SELECT_USER_IN_DATATABLE = '[UserManager] Select/deselect user in Datatable';

export function setUsers(data) {
    return {
        type: SET_USERS,
        payload: data
    };
}

export function resetUserForm() {
    return {
        type: RESET_USER_FORM,
    }
}

export function addUser(user) {
    return {
        type: ADD_USER,
        payload: user,
    }
}

export function editUser(user) {
    return {
        type: EDIT_USER,
        payload: user,
    }
}

export function updateUser(data) {
    if (!data.id_Emp) {
        return;
    }
    return {
        type: UPDATE_USER,
        payload: {
            ...data,
            _loadedFlag: true,
        },
    }
}

export function updateUserOptinalData(uid, data) {
    return {
        type: UPDATE_USER,
        payload: {
            id_Emp: uid,
            ...data,
            _loadedFlag: true,
        },
    }
}

export function deleteUser(id) {
    return {
        type: DELETE_USER,
        payload: id,
    }
}

export function toggleUserActivation(id) {
    return {
        type: TOGGLE_USER_ACTIVATION,
        payload: id
    }
}

export function setSearchWord(searchword) {
    return {
        type: SET_SEARCH_WORD,
        payload: searchword
    }
}

export function selectUserInDataTable(id) {
    return {
        type: SELECT_USER_IN_DATATABLE,
        payload: id,
    }
}

export function setUsersLevels(levels) {
    if (!Array.isArray(levels)) {
        return false;
    }
    return {
        type: SET_USERS_LEVELS,
        payload: levels,
    }
}

export function setCountries(countries) {
    if (!Array.isArray(countries)) {
        return false;
    }
    return {
        type: SET_COUNTRIES,
        payload: countries,
    }
}

export function setRegions(regions) {
    if (!Array.isArray(regions)) {
        return false;
    }
    return {
        type: SET_REGIONS,
        payload: regions,
    }
}

export function setCities(cities) {
    if (!Array.isArray(cities)) {
        return false;
    }
    return {
        type: SET_CITIES,
        payload: cities,
    }
}

export function setWeeklyHours(weeklyHours) {
    return {
        type: SET_WEEKLY_HOURS,
        payload: weeklyHours,
    }
}

export function setStandardCommission(standardCommission) {
    return {
        type: SET_STANDARD_COMMISSION,
        payload: standardCommission,
    }
}