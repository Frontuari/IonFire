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
//  Import for orderby data FROM Angular
import "rxjs/add/operator/map";
//  Import AlaSQL
import 'rxjs/add/operator/take';
import * as alasql from 'alasql';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userActivityHomeList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;
  userActivities = {
    uid: "0",
    totaldays: 0,
    totalweeks: 0,
    totalmonths: 0,
    totalyears: 0
  };

  constructor(public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private toast: ToastController,
    public authService: AuthService,
    private database: AngularFireDatabase) {

    let uaData = [];

    this.afAuth.authState.subscribe(data => {
      if (data && data.uid) {
        this.user.email = data.email;
        this.user.name = data.displayName != null ? data.displayName : '';
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;

        /*
        //  Delete all data by user
        this.database.list('/user-activity',{
          preserveSnapshot: true,
          query: {
            orderByChild: 'uid',
            equalTo: this.user.uid,
          }
        }).take(1).subscribe(snaphots=> {
          snaphots.forEach((snapshot) => {
            this.database.object('/user-activity/' + snapshot.key).remove();
          }) 
        })*/

        //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
        this.userActivityHomeList$ = this.database.list('user-activity')
          .map(_userActivities =>
            _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

        this.userActivityHomeList$.subscribe(
          userActivities => {
            if (userActivities.length > 0) {
              userActivities.map(userActivity => {
                uaData.push({
                  "uid": userActivity.uid,
                  "fecha": userActivity.d_fecha
                });
              })
              //  Sort data by fecha
              uaData.sort(function compare(a, b) {
                let dateA = +new Date(a.fecha);
                let dateB = +new Date(b.fecha);
                return dateA - dateB;
              });

              let userDays = alasql('SELECT uid, count(fecha) AS totaldays FROM ? GROUP BY uid', [uaData]);
              let userWMYs = alasql('SELECT uid,fecha, ROUND(DATEDIFF(Week,DATE(fecha), DATE(Date()))) AS totalweeks \
              , ROUND(DATEDIFF(Month,DATE(fecha), DATE(Date()))) AS totalmonths \
              , ROUND(DATEDIFF(Year,DATE(fecha), DATE(Date()))) AS totalyears \
              FROM ? ORDER BY fecha ASC LIMIT 1', [uaData]);
              this.userActivities = {
                uid: userDays[0].uid,
                totaldays: userDays[0].totaldays,
                totalweeks: userWMYs[0].totalweeks,
                totalmonths: userWMYs[0].totalmonths,
                totalyears: userWMYs[0].totalyears
              }
            }
          }
        );

        //  Send messages to welcome          
        this.toast.create({
          message: `Bienvenido ${this.user.name}`,
          duration: 3000
        }).present();
      } else {
        this.toast.create({
          message: 'No se pudo encontrar detalles de autenticación',
          duration: 3000
        }).present();
      }
    });
  }

  signOut() {
    this.authService.signOut();
    this.navCtrl.setRoot(SignInPage);
  }
}