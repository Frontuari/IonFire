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
import * as alasql from 'alasql';
//  Import momentJS
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userActivityList$: FirebaseListObservable<UserActivity[]>;
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
    let uaAllData = [];

    this.afAuth.authState.subscribe(data => {
      if (data && data.uid) {
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
            if (userActivities.length > 0) {
              userActivities.map(userActivity => {
                uaData.push({
                  "uid": userActivity.uid,
                  "fecha": userActivity.d_fecha
                });
                uaAllData.push({
                  "uid": userActivity.uid,
                  "d_suenho_descanso": userActivity.d_suenho_descanso,
                  "d_alimento": userActivity.d_alimento,
                  "d_yo_cuerpo": userActivity.d_yo_cuerpo,
                  "d_yo_mente": userActivity.d_yo_mente,
                  "d_otros": userActivity.d_otros,
                  "d_trabajo": userActivity.d_trabajo,
                  "d_humanidad": userActivity.d_humanidad,
                  "d_pareja": userActivity.d_pareja,
                  "d_fecha": userActivity.d_fecha,
                  "uid_fecha": userActivity.uid + '_' + userActivity.d_fecha
                })
              })
              //  Sort data by fecha
              uaData.sort(function compare(a, b) {
                let dateA = +new Date(a.fecha);
                let dateB = +new Date(b.fecha);
                return dateA - dateB;
              });
              /**
              * Commented for resolved bug with Bot
              let lastDate = moment(uaData[userActivities.length-1].fecha,'YYYY-MM-DD');
              let compareDate = moment(getCurDate(new Date(),2,'-').toISOString().slice(0, 10),'YYYY-MM-DD');
              let differenceDate = compareDate.diff(lastDate, 'days')
              //  Bot for set average user data 
              if(differenceDate > 0){
                console.log(differenceDate);
                //  Calculate Average to Items
                let newUAData = alasql('SELECT uid, \
                ROUND(AVG(HOUR(d_suenho_descanso))) AS h_suenho_descanso, ROUND(AVG(MINUTE(d_suenho_descanso))) AS m_suenho_descanso, \
                ROUND(AVG(HOUR(d_alimento))) AS h_alimento, ROUND(AVG(MINUTE(d_alimento))) AS m_alimento, \
                ROUND(AVG(HOUR(d_yo_cuerpo))) AS h_yo_cuerpo, ROUND(AVG(MINUTE(d_yo_cuerpo))) AS m_yo_cuerpo, \
                ROUND(AVG(HOUR(d_yo_mente))) AS h_yo_mente, ROUND(AVG(MINUTE(d_yo_mente))) AS m_yo_mente, \
                ROUND(AVG(HOUR(d_otros))) AS h_otros, ROUND(AVG(MINUTE(d_otros))) AS m_otros, \
                ROUND(AVG(HOUR(d_trabajo))) AS h_trabajo, ROUND(AVG(MINUTE(d_trabajo))) AS m_trabajo, \
                ROUND(AVG(HOUR(d_humanidad))) AS h_humanidad, ROUND(AVG(MINUTE(d_humanidad))) AS m_humanidad, \
                ROUND(AVG(HOUR(d_pareja))) AS h_pareja, ROUND(AVG(MINUTE(d_pareja))) AS m_pareja \
                FROM ? GROUP BY uid',[uaAllData]);
                for(let i =1; i<differenceDate; i++){
                  //  Build object datetime
                  let curDate = getCurDate(new Date(uaData[userActivities.length-1].fecha),i+1,'+').toISOString().slice(0, 10);
                  let d_suenho_descanso = curDate+'T'+(newUAData[0].h_suenho_descanso < 10 ? '0'+newUAData[0].h_suenho_descanso: newUAData[0].h_suenho_descanso)+':'+(newUAData[0].m_suenho_descanso < 10 ? '0'+newUAData[0].m_suenho_descanso : newUAData[0].m_suenho_descanso)+':00Z';
                  let d_alimento = curDate+'T'+(newUAData[0].h_alimento < 10 ? '0'+newUAData[0].h_alimento: newUAData[0].h_alimento)+':'+(newUAData[0].m_alimento < 10 ? '0'+newUAData[0].m_alimento : newUAData[0].m_alimento)+':00Z';
                  let d_yo_cuerpo = curDate+'T'+(newUAData[0].h_yo_cuerpo < 10 ? '0'+newUAData[0].h_yo_cuerpo: newUAData[0].h_yo_cuerpo)+':'+(newUAData[0].m_yo_cuerpo < 10 ? '0'+newUAData[0].m_yo_cuerpo : newUAData[0].m_yo_cuerpo)+':00Z';
                  let d_yo_mente = curDate+'T'+(newUAData[0].h_yo_mente < 10 ? '0'+newUAData[0].h_yo_mente: newUAData[0].h_yo_mente)+':'+(newUAData[0].m_yo_mente < 10 ? '0'+newUAData[0].m_yo_mente : newUAData[0].m_yo_mente)+':00Z';
                  let d_otros = curDate+'T'+(newUAData[0].h_otros < 10 ? '0'+newUAData[0].h_otros: newUAData[0].h_otros)+':'+(newUAData[0].m_otros < 10 ? '0'+newUAData[0].m_otros : newUAData[0].m_otros)+':00Z';
                  let d_trabajo = curDate+'T'+(newUAData[0].h_trabajo < 10 ? '0'+newUAData[0].h_trabajo: newUAData[0].h_trabajo)+':'+(newUAData[0].m_trabajo < 10 ? '0'+newUAData[0].m_trabajo : newUAData[0].m_trabajo)+':00Z';
                  let d_humanidad = curDate+'T'+(newUAData[0].h_humanidad < 10 ? '0'+newUAData[0].h_humanidad: newUAData[0].h_humanidad)+':'+(newUAData[0].m_humanidad < 10 ? '0'+newUAData[0].m_humanidad : newUAData[0].m_humanidad)+':00Z';
                  let d_pareja = curDate+'T'+(newUAData[0].h_pareja < 10 ? '0'+newUAData[0].h_pareja: newUAData[0].h_pareja)+':'+(newUAData[0].m_pareja < 10 ? '0'+newUAData[0].m_pareja : newUAData[0].m_pareja)+':00Z';
                  //  Push data to database
                  this.userActivityList$.push({
                    uid: newUAData[0].uid,
                    d_suenho_descanso: d_suenho_descanso,
                    d_alimento: d_alimento,
                    d_yo_cuerpo: d_yo_cuerpo,
                    d_yo_mente: d_yo_mente,
                    d_otros: d_otros,
                    d_trabajo: d_trabajo,
                    d_humanidad: d_humanidad,
                    d_pareja: d_pareja,
                    d_fecha: curDate,
                    uid_fecha: newUAData[0].uid+'_'+curDate
                  });
                }
                /*
                //  Update Data 
                this.userActivityList$ = this.database.list('user-activity')
                  .map(_userActivities => 
                    _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;
                this.userActivityList$.subscribe(
                  userActivities => {
                    userActivities.map(userActivity => {
                      uaData.push({
                        "uid": userActivity.uid,
                        "fecha": userActivity.d_fecha
                      });
                    });
                    //  Sort data by fecha
                    uaData.sort(function compare(a, b) {
                      let dateA = +new Date(a.fecha);
                      let dateB = +new Date(b.fecha);
                      return dateA - dateB;
                    });
                    let userDays = alasql('SELECT uid, count(fecha) AS totaldays FROM ? GROUP BY uid',[uaData]);
                    let userWMYs = alasql('SELECT uid,fecha, ROUND(DATEDIFF(Week,DATE(fecha), DATE(Date()))) AS totalweeks \
                    , ROUND(DATEDIFF(Month,DATE(fecha), DATE(Date()))) AS totalmonths \
                    , ROUND(DATEDIFF(Year,DATE(fecha), DATE(Date()))) AS totalyears \
                    FROM ? ORDER BY fecha ASC LIMIT 1',[uaData]);
                    this.userActivities = {
                      uid: userDays[0].uid,
                      totaldays: userDays[0].totaldays,
                      totalweeks: userWMYs[0].totalweeks,
                      totalmonths: userWMYs[0].totalmonths,
                      totalyears: userWMYs[0].totalyears
                    }
                  }
                );
              }
              */
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

function getCurDate(fecha, dias, operando) {
  if (operando == '+')
    fecha.setDate(fecha.getDate() + dias);
  else
    fecha.setDate(fecha.getDate() - dias);
  return fecha;
}