import { Action } from '@ngrx/store';
import { RootActionsService } from '../services/root-actions.service';
import { ActionWithPayload } from './createAction';

export function rootReducer(state: any = {}, action: Action): any {
  return state;
}

export function combinePersistedAndLocalState(reducer) {
  return function (state, action: Action) {
    if (action.type === RootActionsService.SET_STATE) {
      const updateAction = action as ActionWithPayload;
      return Object.assign({}, state, updateAction.payload);
    }
    return reducer(state, action);
   };
}
