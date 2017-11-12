import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';

import { AuthService } from '../../providers/auth-service';

import { SignInPage } from '../signin/signin';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userActivityList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;
  userActivitySize = 0;

  constructor(public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private toast: ToastController,
    public authService: AuthService,
    private database: AngularFireDatabase) {
    this.afAuth.authState.subscribe(data => {
      if(data && data.uid){
        this.user.email = data.email;
        this.user.name = data.displayName != null ? data.displayName : '';
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;
        //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
        this.userActivityList$ = this.database.list('user-activity')
          .map(_userActivities => 
            _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;
        
        this.userActivityList$.subscribe(
          userActivities => {
            this.userActivitySize = userActivities.length;
          }
        );
        //  Send messages to welcome          
        this.toast.create({
          message:`Bienvenido ${this.user.name}`,
          duration:3000
        }).present();
      }else{
        this.toast.create({
          message:'No se pudo encontrar detalles de autenticación',
          duration:3000
        }).present();
      }
    });
  }

  signOut() {
    this.authService.signOut();
    this.navCtrl.setRoot(SignInPage);
  }
}
