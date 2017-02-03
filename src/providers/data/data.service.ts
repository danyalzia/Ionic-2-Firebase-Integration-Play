import {Injectable} from '@angular/core';

import firebase from 'firebase';

import { Storage } from '@ionic/storage';

@Injectable()
export class DataService {
    public db: any;
    public staticData: any;
	
    constructor(public storage: Storage) {}

    init() {
		const config = {
			apiKey: "AIzaSyBcSXHF8LARZQJDoWSoLGuQO6DMAm6KDMo",
			authDomain: "awesome-app-ionic.firebaseapp.com",
			databaseURL: "https://awesome-app-ionic.firebaseio.com",
			storageBucket: "awesome-app-ionic.appspot.com",
			messagingSenderId: "931508989005"
		};

		firebase.initializeApp(config);
		
		this.db = firebase.database().ref('/');
		this.staticData = firebase.database().ref('/static');
    }
	
	getData() {
		return this.storage.get('todos');  
  }

  save(data){
    let newData = JSON.stringify(data);
    this.storage.set('todos', newData);
  }
}
