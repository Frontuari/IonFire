import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service';
import { UserModel } from '../models/user-model';

import { SignInPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { AcercaPage } from "../pages/acerca/acerca";
import { AgregarPage } from "../pages/agregar/agregar";

import { TabsPage } from '../pages/tabs/tabs';
import { GuiaPage } from "../pages/guia/guia";




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: Nav;
  public rootPage:any;

  public pages: Array<{title: string, component: any, icon: string , color: string}>;

  public user = {} as UserModel;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    authService: AuthService) {
    // used for an example of ngFor and navigation
    this.rootPage = SignInPage;

    this.pages = [
      { title: 'Inicio',        component: HomePage, icon: 'home', color: 'dark' },
      { title: 'Agregar Datos', component: AgregarPage, icon: 'add-circle', color: 'dark' },      
      { title: 'Consultar ',    component: TabsPage, icon: 'filing', color: 'dark' },/* paper, podium */
      { title: 'Guía rápida',     component: GuiaPage, icon: 'help', color: 'dark' },
      { title: 'Acerca de',     component: AcercaPage, icon: 'information-circle', color: 'dark' }      
    ];
    
    if (authService.authenticated) {
      this.rootPage = SignInPage;
    } 
    else {
      this.user = authService.userModel;
      this.rootPage = HomePage;
    }

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goToPage(page){
    this.nav.setRoot(page);  
  }
}
