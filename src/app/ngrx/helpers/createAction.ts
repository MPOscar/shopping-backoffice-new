import { Action } from '@ngrx/store';

export class ActionWithPayload implements Action {
    type: string;
    payload: any;
}

export function createAction(type, payload?): Action {
    const action = { type, payload };
    return action;
}
