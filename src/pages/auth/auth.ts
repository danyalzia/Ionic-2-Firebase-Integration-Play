import { Component, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { DataService } from '../../providers/data/data.service';
import { UserService } from '../../providers/user/user.service';

@Component({
    templateUrl: './auth.html',
})
export class AuthPage {
	public userEmail: string;
	public userPassword: string;

	public authStatus: boolean;
	public message: string;

	private isAuth: BehaviorSubject<boolean>;

	constructor(private _data:DataService, private _user:UserService, private _cd:ChangeDetectorRef) {
		this.isAuth = new BehaviorSubject(false);

		this.isAuth.subscribe(val => this.authStatus = val);
	}

	ionViewDidLoad() {
		Promise.all([this.fetchMessage()]);

		this._user.auth.onAuthStateChanged(user => {
			this.isAuth.next(!!user);
			this._cd.detectChanges();
		});
	}

	private fetchMessage() {
		return new Promise(res => {
		  this._data.db.child('static').on('value', data => {
			this.message = data.val();
			res();
		  });
		});
	}

	public logout() {
		this._user.logout()
	}

	public login() {
		this._user.login(this.userEmail, this.userPassword)
	}
}
