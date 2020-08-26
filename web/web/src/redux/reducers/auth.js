import {SIGN_IN, LOG_OUT } from "../actionTypes";
import { USERS_ROLE } from 'constant'

const initialState = {
    token: null,
    user: {},
    isAuthenticated: false,
    hasRole: {
        admin: false,
        controller: false,
        ca: false,
        ce: false,
        acj: false
    }
};

const authReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case SIGN_IN:
            const role = action.user.role;

            return {
                ...state,
                token: action.token,
                user: action.user,
                isAuthenticated: true,
                hasRole: {
                    admin: role === USERS_ROLE.ROLE_ADMIN,
                    controller: role === USERS_ROLE.ROLE_CONTROLLER,
                    ca: role === USERS_ROLE.ROLE_CA,
                    ce: role === USERS_ROLE.ROLE_CE,
                    acj: role === USERS_ROLE.ROLE_ACJ
                }
            };
        case LOG_OUT:
            return initialState;
        default:
            return state;
    }
}

export default authReducer;