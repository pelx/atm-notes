import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { User } from '../models/user';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
    isLoading = false;
    isLogin = true;

    private _user = new BehaviorSubject<User>(null);

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
    }

    private showAlert(message: string) {
        this.alertCtrl.create({
            header: 'Authentication failed',
            message: message,
            buttons: ['Okay']
        })
            .then(alertEl => {
                alertEl.present();
            });
    }

    authenticate(email: string, password: string) {
        this.isLoading = true;
        this.loadingCtrl
            .create({
                keyboardClose: true,
                message: 'Loading...',
                spinner: "lines"
            })
            .then(loadingEl => {
                loadingEl.present();
                let authObs: Observable<AuthResponseData>;

                if (this.isLogin) {
                    authObs = this.authService.login(email, password);
                } else {
                    authObs = this.authService.signup(email, password);
                }

                // signup or login using the same OBSERVABLE !!!
                authObs
                    .subscribe(res => {
                        this.isLoading = false;
                        loadingEl.dismiss();
                        this.router.navigateByUrl('/atms/tabs/collections');
                    },
                        errorRes => {
                            // ERROR!!!
                            loadingEl.dismiss();
                            const errCode = errorRes.error.error.message;
                            let message = '';
                            if (errCode === 'EMAIL_EXISTS') {
                                message = 'This Email exists already.';
                                this.showAlert(message);
                            } else if (errCode === 'EMAIL_NOT_FOUND') {
                                message = 'The Email address was not found.';
                                this.showAlert(message);

                            } else if (errCode === 'INVALID_PASSWORD') {

                                message = 'The password is incorrect.';
                            } else {
                                message = message + ': ' + errCode;
                            }
                            this.showAlert(message);

                        });
            });
    }

    // onLogin() {
    //     this.isLoading = true;
    //     this.authService.login();
    //     this.loadingCtrl
    //         .create({
    //             keyboardClose: true,
    //             message: 'Loading...',
    //             spinner: "lines"
    //         })
    //         .then(loadingEl => {
    //             loadingEl.present();
    //             setTimeout(() => {
    //                 this.isLoading = false;
    //                 loadingEl.dismiss();
    //                 this.router.navigateByUrl('/atms/tabs/collections');
    //             }, 1500);

    //         });
    // }

    onSubmit(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const password = form.value.password;
        const email = form.value.email;
        // console.log('AUTH PAGE ONSUBMIT', email, ' : ', password);
        this.authenticate(email, password);
        form.reset();
    }

    onSwitchAuthMode(form: NgForm) {
        this.isLogin = !this.isLogin;
        form.reset();
    }

}
