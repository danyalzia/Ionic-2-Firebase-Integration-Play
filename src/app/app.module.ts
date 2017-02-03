import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ShowdataPage } from '../pages/showdata/showdata';

import { AuthService } from "./auth.service";

import {DataTableModule} from "angular2-datatable";

import {
  ReactiveFormsModule
} from '@angular/forms';

import { AuthGuard } from "./auth.guard";

import { AuthPage } from '../pages/auth/auth';
import { TodoAddItem } from '../pages/todo-add-item/todo-add-item';
import { TodoItemInfo } from '../pages/todo-item-info/todo-item-info';
import { TodoPage } from '../pages/todo/todo';
import { FileuploadPage } from '../pages/fileupload/fileupload';

import { DataService } from '../providers/data/data.service';
import { UserService } from '../providers/user/user.service';

import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
	SigninPage,
	SignupPage,
	ShowdataPage,
	AuthPage,
	TodoAddItem,
    TodoItemInfo,
	TodoPage,
	FileuploadPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
	tabsPlacement: 'bottom',
	  platforms: {
		android: {
		  tabsPlacement: 'top'
		},
		ios: {
		  tabsPlacement: 'top'
		},
		windows:
		{
		  tabsPlacement: 'top'
		}
	  }
	}),
	DataTableModule,
	ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
	SigninPage,
	SignupPage,
	ShowdataPage,
    AuthPage,
	TodoAddItem,
    TodoItemInfo,
	TodoPage,
	FileuploadPage
  ],
  providers: [Storage, DataService, UserService, AuthService, AuthGuard, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
