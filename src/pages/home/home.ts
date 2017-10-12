import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { SignInPage } from '../signin/signin';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase/app';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User;

  constructor(public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    private toast: ToastController,
    public authService: AuthService) {

  }

  signOut() {
    this.authService.signOut();
    this.navCtrl.setRoot(SignInPage);
  }

  ionViewWillLoad(){
    var username 
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.displayName){
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


}
