import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { User, Promise } from 'firebase/app';

import { UserModel } from '../models/user-model';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  user: firebase.User;

  constructor(public angularFireAuth: AngularFireAuth) {
    angularFireAuth.authState.subscribe((user: firebase.User) => {
      this.user = user;
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
  signInWithPopupGoogle(): firebase.Promise<any> {
    return this.angularFireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  /* CON google+ */
}
