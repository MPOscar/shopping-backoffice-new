import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createAction } from '../helpers/createAction';

@Injectable({
  providedIn: 'root'
})
export class RootActionsService {

  static SET_STATE = 'SET_STATE';

  constructor(private store: Store<any>) { }

  setState(state: any) {
    //this.store.dispatch(createAction(RootActionsService.SET_STATE, state));
  }

}
