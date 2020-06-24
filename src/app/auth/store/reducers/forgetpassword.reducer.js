import * as Actions from '../actions';

const initialState = {
    success: false,
    email: null,
    error  : {
        email: null
    }
};

const forgetpassword = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.FORGET_PASSWORD_SUCCESS:
        {
            return {
                success: true,
                email: action.payload
            };
        }
        case Actions.FORGET_PASSWORD_ERROR:
        {
            return {
                success: false,
                error  : action.payload
            };
        }
        default:
        {
            return state
        }
    }
};

export default forgetpassword;