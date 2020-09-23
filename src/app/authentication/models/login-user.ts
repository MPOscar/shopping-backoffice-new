import { LoginAction } from './login-action';


export class LoginUser implements LoginAction {
    user: {
        username: string,
        first_name: string,
        last_name: string,
        group: string | Array<string>
    };
    data:{
        access_token: string;       
    };
    preferences: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    access_token: string;
    mfa_code: any;
    backup_code: any;

    constructor(user: { username: string; first_name: string; last_name: string; group: string | Array<string> },
                data: { access_token: string },
                preferences: string, refresh_token: string, scope: string, token_type: string, expires_in: number,
                access_token: string, mfa_code: any, backup_code: any) {
        this.user = user;
        this.data = data;
        this.preferences = preferences;
        this.refresh_token = refresh_token;
        this.scope = scope;
        this.token_type = token_type;
        this.expires_in = expires_in;
        this.access_token = access_token;
        this.mfa_code = mfa_code;
        this.backup_code = backup_code;
    }
}

