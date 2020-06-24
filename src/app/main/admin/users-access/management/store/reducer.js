import * as Actions from './actions';

const initialState = {
    data: [],
    selectedIds: [],
    searchWord: null,
    usersLevels: null,
    countries: null,
    regions: null,
    cities: null,
    standardComission: 50,
    weeklyHours: 35,
};

const userReducer = function (state = initialState, action) {
    switch ( action.type ) {
        case Actions.SET_USERS: {
            return {
                ...state,
                data: action.payload
            };
        }
        
        case Actions.ADD_USER: {
            return {
                ...state,
                data: [
                    ...state.data,
                    action.payload,
                ]
            };
        }

        case Actions.UPDATE_USER: {
            let data = state.data.map(item => {
                if (item.id_Emp === action.payload.id_Emp) {
                    return {
                        ...item,
                        ...action.payload,
                    }
                } 
                return item;
            });

            if (data.length === 0) {
                data = [action.payload];
            }

            return {
                ...state,
                data
            };
        }

        case Actions.DELETE_USER: {
            const id = action.payload;
            return {
                ...state,
                data: state.data.filter(item => item.id_Emp !== id)
            };
        }

        case Actions.SET_SEARCH_WORD: {
            return {
                ...state,
                searchWord: action.payload,
            };
        }

        case Actions.TOGGLE_USER_ACTIVATION: {
            const id = action.payload;
            return {
                ...state,
                data: state.data.map(item => {
                    if (item.id_Emp === id) {
                        item.actif = !Boolean(item.actif);
                    }
                    return item;
                })
            };
        }

        case Actions.SELECT_USER_IN_DATATABLE: {
            const id = action.payload;
            if (id === 0) {
                if (state.selectedIds.length === state.data.length){
                    return {
                        ...state,
                        selectedIds: [],
                    };
                } else {
                    return {
                        ...state,
                        selectedIds: state.data.map(item => item.id_Emp),
                    };
                }
            } else if (state.selectedIds.indexOf(id) >= 0) {
                return {
                    ...state,
                    selectedIds: state.selectedIds.filter(item => item !== id),
                };
            } else {
                return {
                    ...state,
                    selectedIds: [...state.selectedIds, id],
                };
            }
        }

        case Actions.SET_USERS_LEVELS: {
            return {
                ...state,
                usersLevels: action.payload,
            };
        }

        case Actions.SET_COUNTRIES: {
            return {
                ...state,
                countries: action.payload,
            };
        }

        case Actions.SET_CITIES: {
            return {
                ...state,
                cities: action.payload,
            };
        }

        case Actions.SET_REGIONS: {
            return {
                ...state,
                regions: action.payload,
            };
        }

        case Actions.SET_WEEKLY_HOURS: {
            return {
                ...state,
                weeklyHours: action.payload,
            };
        }

        case Actions.SET_STANDARD_COMMISSION: {
            return {
                ...state,
                standardComission: action.payload,
            };
        }

        default: {
            return state;
        }
    }
};

export default userReducer;
