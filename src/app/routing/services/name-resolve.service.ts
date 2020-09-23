import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameResolveService implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any {
    return of(route.paramMap.get('name'));
  }
}
