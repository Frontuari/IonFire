import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { SignInPage } from '../signin/signin';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase/app';

import { UserModel } from '../../models/user-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user =  {} as UserModel;

  constructor(public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private toast: ToastController,
    public authService: AuthService) {
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.displayName){
        this.user.email = data.email;
        this.user.name = data.displayName;
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;
        this.toast.create({
          message:`Bienvenido ${data.displayName}`,
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

  /*
  ionViewWillLoad(){
    var username;
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.displayName){
        console.log(data);
        username = data.displayName;
        this.toast.create({
          message:`Bienvenido ${data.displayName}`,
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
  */
}
