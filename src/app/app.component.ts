import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Plugins, Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private authSub: Subscription;
    private preiousAuthState = false;
    constructor(
        private platform: Platform,
        // private splashScreen: SplashScreen,
        // private statusBar: StatusBar,
        private authService: AuthService,
        private router: Router
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // this.statusBar.styleDefault();
            // this.splashScreen.hide();
            if (Capacitor.isPluginAvailable('SplashScreen')) {
                Plugins.SplashScreen.hide();
            }
        });
    }

    onLogout() {
        this.authService.logout();
        // this.router.navigateByUrl('/auth');
    }

    ngOnInit() {
        this.authSub = this.authService.userIsAuthenticated
            .subscribe(isAuth => {
                if (!isAuth && this.preiousAuthState !== isAuth) {
                    this.router.navigateByUrl('/auth');
                }
                this.preiousAuthState = isAuth;
            });
    }

    ngOnDestroy() {
        if (this.authSub) {
            this.authSub.unsubscribe();
        }
    }
}
