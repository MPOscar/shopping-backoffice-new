import { ViewChild, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CanComponentDeactivate } from '../services/can-deactivate-route-guard.service';

@Directive()
export class BaseRouteComponent {

    @ViewChild('smartComponent') smartComponent: CanComponentDeactivate;

    constructor(
        public router: Router,
        public activatedRoute: ActivatedRoute) {}
    
    close() {
        this.router.navigate(this.activatedRoute.snapshot.data.closeRouteCommand, {relativeTo: this.activatedRoute});
    }

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        return this.smartComponent.canDeactivate ? this.smartComponent.canDeactivate() : of(false);
    }
    
}
