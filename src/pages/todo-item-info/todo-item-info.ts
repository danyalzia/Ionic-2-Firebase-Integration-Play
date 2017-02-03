import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import firebase from 'firebase';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-todo-item-info',
  templateUrl: 'todo-item-info.html'
})
export class TodoItemInfo {
  email;
  title;
  description;
  id;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
	console.log('ionViewDidLoad TodoItemInfo');
	this.email = this.navParams.get('item').email;
    this.title = this.navParams.get('item').title;
    this.description = this.navParams.get('item').description;
	
	this.id = this.navParams.get('item').id;
  }
  
  delete() {
	var userId = firebase.auth().currentUser.uid;
	  
	firebase.database().ref('todo/' + this.id).set({
		email: null,
		title: null,
		description : null
	});
	
	this.navParams.get('parentPage').showData()
	
	this.navCtrl.pop();
  }
}