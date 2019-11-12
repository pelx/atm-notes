import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }
    canLoad(
        route: Route,
        segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.userIsAuthenticated.pipe(
            take(1),
            // attempt autologin
            switchMap(isAuthenticated => {
                if (!isAuthenticated) {
                    // try to autologin !!!
                    return this.authService.autoLogin();
                } else {
                    return of(isAuthenticated);
                }
            }),
            tap(isAuthenticated => {
                if (!isAuthenticated) {
                    this.router.navigateByUrl('/auth');
                }
            })
        );
    }

}
