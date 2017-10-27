import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
/* Base de datos */
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from '../providers/auth-service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/signin/signin';
import { SignUpPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { AcercaPage } from "../pages/acerca/acerca";
import { ConsultarPage } from "../pages/consultar/consultar";
import { AgregarPage } from "../pages/agregar/agregar";

import { TabsPage } from '../pages/tabs/tabs';
import { GuiaPage } from "../pages/guia/guia";

//  Import AddUserActivityPage and EditUserActivityPage
import { AddUserActivityPage } from '../pages/add-user-activity/add-user-activity';
import { EditUserActivityPage } from '../pages/edit-user-activity/edit-user-activity';

import { ChartModule } from 'angular2-highcharts';
import * as highcharts from 'highcharts';
//  Import FireBase Credentials
import { firebaseConfig } from './app.firebase.config';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignInPage,
    SignUpPage,
    ResetPasswordPage,
    AcercaPage,
    ConsultarPage,
    AgregarPage,
    TabsPage,
    GuiaPage,
    AddUserActivityPage,
    EditUserActivityPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    ChartModule.forRoot(highcharts),    
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignInPage,
    SignUpPage,
    ResetPasswordPage,
    AcercaPage,
    ConsultarPage,
    AgregarPage,
    TabsPage,
    GuiaPage,
    AddUserActivityPage,
    EditUserActivityPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    Facebook,
    TwitterConnect
  ]
})
export class AppModule {}
