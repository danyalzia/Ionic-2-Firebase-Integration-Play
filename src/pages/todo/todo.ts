import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ModalController } from 'ionic-angular';

import { DataService } from '../../providers/data/data.service';

import { TodoAddItem } from '../todo-add-item/todo-add-item'
import { TodoItemInfo } from '../todo-item-info/todo-item-info';

import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { UserService } from '../../providers/user/user.service';

import firebase from 'firebase';

@Component({
  selector: 'page-todo',
  templateUrl: 'todo.html'
})
export class TodoPage {
	// For Login
	public userEmail: string;
	public userPassword: string;

	public authStatus: boolean;
	public message: string;

	private isAuth: BehaviorSubject<boolean>;

	public todoArray: any;
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad TodoPage');
		this._user.auth.onAuthStateChanged(user => {
			this.isAuth.next(!!user);
			this._cd.detectChanges();
		});
	}

	public items = [];
	
	
	constructor(public navCtrl: NavController, private _data: DataService, public modalCtrl: ModalController, private _user:UserService, private _cd:ChangeDetectorRef) {
	  
		this.isAuth = new BehaviorSubject(false);

		this.isAuth.subscribe(val => this.authStatus = val);
			
		this._data.getData().then((todos) => {

		if(todos){
			this.items = JSON.parse(todos);	
		}

		});	
		
		this.showData();
	}

	showData() {
		var self = this;
		
		var user = firebase.auth().currentUser;

		if (user) {
		  // User is signed in.
		  this.userEmail = user.email;
		} else {
		  // No user is signed in.
		}

		var ref = firebase.database().ref('/todo/');
		ref.once('value').then(function(snapshot) {
			// We need to create this array first to store our local data
			let rawList = [];
			snapshot.forEach( snap => {
				if (snap.val().email == self.userEmail) {
					rawList.push({
					  id: snap.key,
					  email: snap.val().email,
					  title: snap.val().title,
					  description: snap.val().description,
					});
				}
		  });
			
			self.todoArray = rawList;
			
			
		});
	}
	
	addItem(){

		let addModal = this.modalCtrl.create(TodoAddItem);

		addModal.onDidDismiss((item) => {
			if(item){
				this.storeItem(item);
				this.showData();
			}
		});

		addModal.present();
		
		
	}

	storeItem(item){
		this.items.push(item);
	}

	showItem(item){
		// Let's pass the item param
		this.navCtrl.push(TodoItemInfo, {
		  item: item,
		  "parentPage": this
		});
	}

	public logout() {
		this._user.logout()
		this.showData();
	}

	public login() {
		this._user.login(this.userEmail, this.userPassword)
		this.showData();
	}
}
