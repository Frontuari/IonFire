import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProfile } from '../../models/user-profile/user-profile.interface';
import { HomePage } from '../home/home';
import 'rxjs/add/operator/take';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profile = {
    uid: "0",
    email: "",
    name: "",
    birthday: new Date(),
    gender: "",
    photoURL: ""
  } as UserProfile;

  userProfileRef$: FirebaseListObservable<UserProfile[]>;
  userProfileList$: FirebaseListObservable<UserProfile[]>;

  uidProfile = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    private database: AngularFireDatabase) {
    this.uidProfile = this.navParams.get('uid');
    this.userProfileRef$ = this.database.list('user-profile');
    this.afAuth.authState.subscribe(data => {
      if(data && data.uid){
        this.userProfileList$ = this.database.list('user-profile')
          .map(_userProfiles =>
            _userProfiles.filter(userProfile => userProfile.uid == this.uidProfile)) as FirebaseListObservable<UserProfile[]>;
        this.userProfileList$.subscribe(
          userProfiles => {
            userProfiles.map(profile => {
              this.profile = {
                uid: (profile.uid !="" ? profile.uid : data.uid),
                email: (profile.email != "" ? profile.email : data.email),
                name: (profile.name !="" ? profile.name : data.displayName),
                birthday: (profile.birthday != null ? profile.birthday : getCurDate(new Date(),(18*365),'-')),
                gender: (profile.gender !="" ? profile.gender : "F"),
                photoURL: (profile.photoURL != "" ? profile.photoURL : data.photoURL)
              }
            })
          })
      }else{
        this.toast.create({
          message:'No se pudo encontrar detalles de autenticación',
          duration:3000
        }).present();
      }
    });
  }

  UpdateProfile(profile: UserProfile){
    this.userProfileList$ = this.database.list('user-profile')
      .map(_userProfiles =>
        _userProfiles.filter(userProfile => userProfile.uid == this.uidProfile)) as FirebaseListObservable<UserProfile[]>;
    this.userProfileList$.subscribe(
        userProfiles => {
          if(userProfiles.length > 0){
            this.database.list('/user-profile',{
              preserveSnapshot: true,
              query: {
                orderByChild: 'uid',
                equalTo: this.uidProfile,
              }
            }).take(1).subscribe(snaphots=> {
              snaphots.forEach((snapshot) => {
                this.database.object('/user-profile/' + snapshot.key).update(profile);
              }) 
            })
            //  Send the user back to HomePage
            this.navCtrl.setRoot(HomePage);
          }
          else{
            //  Push this to our Firebase database under the 'user-activity' node.
            this.userProfileRef$.push({
              uid: this.profile.uid,
              email: this.profile.email,
              name: this.profile.name,
              birthday: this.profile.birthday,
              gender: this.profile.gender,
              photoURL: this.profile.photoURL
            });
            //  Send the user back to HomePage
            this.navCtrl.setRoot(HomePage);
          }
        });
  }
}

function getCurDate(fecha,dias,operando){
  if(operando == '+')
    fecha.setDate(fecha.getDate() + dias);
  else
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}