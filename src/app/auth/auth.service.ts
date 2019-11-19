import { User } from './../models/user';
import { environment } from './../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

export interface AuthResponseData {
    kind?: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    private _user = new BehaviorSubject<User>(null);
    private activeLogoutTimer: any;
    // private _userId = null;
    // private _token = null;
    // private _userIsAuthenticated = false;

    signupUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
    signinUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

    constructor(private http: HttpClient) { }

    get userIsAuthenticated() {
        return this._user.asObservable()
            .pipe(
                map(user => {
                    if (user) {
                        return !!user.token;// force convertion to boolean
                    } else {
                        return false;
                    }
                })
            );
    }

    get userId() {
        return this._user.asObservable()
            .pipe(
                map(user => {
                    if (user) {
                        return user.id;
                    } else {
                        return null;
                    }
                })
            );
    }

    get token() {
        return this._user.asObservable()
            .pipe(
                map(user => {
                    if (user) {
                        return user.token;
                    } else {
                        return null;
                    }
                })
            );
    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(`${this.signupUrl}${environment.firebaseAPIKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
            .pipe(
                tap(
                    // this refers to auth service class not tap function!!!
                    this.setUserData.bind(this)
                )
            );
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(`${this.signinUrl}${environment.firebaseAPIKey}`,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(
                tap(this.setUserData.bind(this)
                )
            );
        //bind data to the class, pass reference to the method??
    }

    logout() {
        if (this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer);
        }
        this._user.next(null);
        Plugins.Storage.remove({ key: 'authData' });
    }

    autoLogin() {
        // turn promise into observable
        return from(Plugins.Storage.get({ key: 'authData' }))
            .pipe(
                map(storedData => {
                    if ((!storedData || !storedData.value)) {

                        // if (!storedData || storedData.valueOf() == null) {

                        return null;
                    }
                    const parsedData = JSON.parse(storedData.value) as
                        {
                            email: string,
                            token: string,
                            tokenExpiryDate: string,
                            userId: string
                        };
                    // console.log("STORE DATA: ", storedData.valueOf());
                    const expiryTime = new Date(parsedData.tokenExpiryDate);
                    if (expiryTime <= new Date()) {
                        return null;
                    }
                    const user = new User(
                        parsedData.userId,
                        parsedData.email,
                        parsedData.token,
                        expiryTime
                    );
                    return user;
                }),
                // emimit user
                tap(user => {
                    if (user) {
                        this._user.next(user);
                        this.autoLogout(user.tokenDuration);
                    }
                }),
                // return true or false using !!
                map(user => {
                    return !!user;
                })
            );
    }

    private setUserData(userData: AuthResponseData) {
        const expiryTime = new Date(
            new Date().getTime() + (+userData.expiresIn * 1000)
        );
        const user = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expiryTime);
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
        // Store data in local storage
        this.storeAuthData(
            userData.localId,
            userData.idToken,
            expiryTime.toISOString(),
            userData.email);
    }
    // store User data in local storage
    private storeAuthData(
        userId: string,
        token: string,
        tokenExpiryDate: string,
        email: string) {
        const data = JSON.stringify({
            userId: userId,
            token: token,
            tokenExpiryDate: tokenExpiryDate,
            email: email
        });
        // console.log('STORE AUTH DATA:', data);

        Plugins.Storage.set({
            key: 'authData',
            value: data
        });
    }

    private autoLogout(duration: number) {
        if (this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer);
        }
        this.activeLogoutTimer = setTimeout(() => {
            this.logout();
        }, duration)
    }

    ngOnDestroy() {
        if (this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer);
        }
    }
}
