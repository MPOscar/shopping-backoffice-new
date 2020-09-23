import { LoginUser } from './login-user';

// Common interaction point for login responses
export interface LoginAction {

}

export function isLoginUser(loginUser: LoginUser ): loginUser is LoginUser {
    return (<LoginUser>loginUser).user !== undefined;
}