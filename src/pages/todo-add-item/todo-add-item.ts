import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
  selector: 'todo-add-item',
  templateUrl: 'todo-add-item.html'
})
export class TodoAddItem {
	
	title;
	description;

	userEmail;
	constructor(public nav: NavController, public view: ViewController) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TodoAddItem');
	}
  
	storeItem(){

		let newItem = {
		  title: this.title,
		  description: this.description
		};

		this.view.dismiss(newItem);
		
		var self = this;
		
		var userId = firebase.auth().currentUser.uid;

		console.log(userId);
		
		var user = firebase.auth().currentUser;
		this.userEmail = user.email;

		// A post entry.
		var postData = {
			email: this.userEmail,
			title: this.title,
			description: this.description
		};

		// Get a key for a new Post.
		var newPostKey = firebase.database().ref().child('todo').push().key;

		// Write the new post's data simultaneously in the posts list and the user's post list.
		var updates = {};
		updates['/todo/' + newPostKey] = postData;
		//updates['/todo/' + uid + '/' + newPostKey] = postData;

		firebase.database().ref().update(updates);
	}

	close(){
		this.view.dismiss();
	}
}