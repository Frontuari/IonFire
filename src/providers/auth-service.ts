import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { User, Promise } from 'firebase/app';

import { UserModel } from '../models/user-model';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  user: firebase.User;
  userModel = {
    uid: "0",
    email: "",
    name: "Bienvenido",
    photoURL: "assets/images/ANDDANDOMK600.png"
  } as UserModel;

  constructor(public angularFireAuth: AngularFireAuth) {
    angularFireAuth.authState.subscribe((user: firebase.User) => {
      this.user = user;
      if(user.uid != null)
        this.userModel.uid = user.uid;
      else
        this.userModel.uid = "0";
      this.userModel.email = user.email;

      if(user.displayName != null)
        this.userModel.name = user.displayName;
      else
        this.userModel.name = "Bienvenido";

      if(user.photoURL != null)
        this.userModel.photoURL = user.photoURL;
      else
        this.userModel.photoURL = "assets/images/ANDDANDOMK600.png";
    });
  }

  get authenticated(): boolean {
    return this.user != null;
  }
/*AUTENTICACION FIREBASE  */
  signInWithEmailAndPassword(userModel: UserModel): firebase.Promise<any> {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(userModel.email, userModel.password);
  }
/*CREAR USUARIOS FIREBASE  */
  createUserWithEmailAndPassword(userModel: UserModel): firebase.Promise<any> {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(userModel.email, userModel.password);
  }

  /*REINICIAR CLAVE FIREBASE  */
  resetPassword(userModel: UserModel): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(userModel.email);
  }

  /*CERRAR SESSION FIREBASE  */
  signOut(): firebase.Promise<any> {
    return this.angularFireAuth.auth.signOut();
  }


/*CON FACEBOOK  */
  signInWithFacebook(accessToken: string): firebase.Promise<any> {
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    return this.angularFireAuth.auth.signInWithCredential(facebookCredential);
  }

  signInWithPopup(): firebase.Promise<any> {
    return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }
  /*CON FACEBOOK  */

  /* Con Twitter */

  signInWithPopupTwitter(): firebase.Promise<any> {
    return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  /* CON google+ */
/*   signInWithPopupGoogle(): firebase.Promise<any> {
    return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  } */
  /* CON google+ */
}
