import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Camera, Device } from 'ionic-native';

import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { UserService } from '../../providers/user/user.service';

import * as firebase from 'firebase';

declare var window: any;

@Component({
  selector: 'page-fileupload',
  templateUrl: 'fileupload.html'
})
export class FileuploadPage {

  picturesArray: any;
  
  // For Login
  public userEmail: string;
  public userPassword: string;

  public authStatus: boolean;
  public message: string;

  private isAuth: BehaviorSubject<boolean>;
	
  constructor(public navCtrl: NavController, public platform: Platform, private http: Http, private _cd:ChangeDetectorRef, private _user:UserService) {

	this.isAuth = new BehaviorSubject(false);

	this.isAuth.subscribe(val => this.authStatus = val);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FileuploadPage');
	this._user.auth.onAuthStateChanged(user => {
		this.isAuth.next(!!user);
		this._cd.detectChanges();
	});
  }
  
  ngOnInit() {
	// Let's load our data here
	this.loadData();
  }

  loadData() {
    firebase.database().ref('assets').on('value', (snapshot: any) => {
	  // We need to create this array first to store our local data
	  let rawList = [];
	  // Iterate to every value
      snapshot.forEach((childSnapshot) => {
        var element = childSnapshot.val();
        element.id = childSnapshot.key;

        rawList.push(element);
      });

      this.picturesArray = rawList;
    });
  }

  convertIntoBlob(imagePath) {
    // https://firebase.google.com/docs/storage/web/upload-files
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'image.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  uploadToFirebase(imageBlob) {
	// Let's use a simple name
    var fileName = 'image-' + new Date().getTime() + '.jpg';

    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('images/' + fileName);

      var uploadTask = fileRef.put(imageBlob);

      uploadTask.on('state_changed', (snapshot) => {
        console.log('snapshot progess ' + snapshot);
      }, (error) => {
        reject(error);
      }, () => {
        resolve(uploadTask.snapshot);
      });
    });
  }

  saveToDatabaseAssetList(uploadSnapshot) {
    var ref = firebase.database().ref('assets');

    return new Promise((resolve, reject) => {
		
      var dataToSave = {
        'URL': uploadSnapshot.downloadURL, 
        'name': uploadSnapshot.metadata.name,
        'owner': firebase.auth().currentUser.uid,
        'email': firebase.auth().currentUser.email,
        'lastUpdated': new Date().getTime(),
      };

      ref.push(dataToSave, (response) => {
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  doGetPicture() {

    let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: imageSource,
      targetHeight: 640,
      correctOrientation: true
    }).then((imagePath) => {
      return this.convertIntoBlob(imagePath);
    }).then((imageBlob) => {
      return this.uploadToFirebase(imageBlob);
    }).then((uploadSnapshot: any) => {
      return this.saveToDatabaseAssetList(uploadSnapshot);

    }).then((uploadSnapshot: any) => {
      //alert('file saved to asset catalog successfully  ');
    }, (error) => {
      alert('Error ' + (error.message || error));
    });

  }
  
  public logout() {
	this._user.logout()
  }

  public login() {
	this._user.login(this.userEmail, this.userPassword)
  }
}
