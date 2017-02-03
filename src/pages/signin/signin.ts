import { Component, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { DataService } from '../../providers/data/data.service';
import { UserService } from '../../providers/user/user.service';

import { ShowdataPage } from '../showdata/showdata';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

public userEmail: string;
	public userPassword: string;

	public authStatus: boolean;
	public message: string;

	private isAuth: BehaviorSubject<boolean>;

    constructor(public nav: NavController, private _data:DataService, private _user:UserService, private _cd:ChangeDetectorRef) {
		this.nav = nav;
		this.isAuth = new BehaviorSubject(false);

		this.isAuth.subscribe(val => this.authStatus = val);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SigninPage');
	
		this._user.auth.onAuthStateChanged(user => {
			this.isAuth.next(!!user);
			this._cd.detectChanges();
		});
	}

	public logout() {
		this._user.logout()
	}

	public login() {
		this._user.login(this.userEmail, this.userPassword)
	}

    ngOnInit():any {

    }
}
