import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
//  Imports UserModels and AuthService
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";

@Component({
  selector: 'page-consultar',
  templateUrl: 'consultar.html',
})
export class ConsultarPage {
  chartOptions: any;
  userActivityList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;

  f_actual = new Date();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    private database: AngularFireDatabase) {

    this.afAuth.authState.subscribe(data => {
      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityList$ = this.database.list('user-activity')
        .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

      this.userActivityList$.subscribe(
        userActivities => {
          userActivities.map(userActivity =>
              getCurrentMonthData(userActivity)
          )
      });
    });

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Vibra '+getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear()
      },
      xAxis: {
        categories: ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
      },
      yAxis: {
        title: {
          text: 'Promedio'
        }
      },
      series: [{
        name: 'Semana 1',
        data: [0.00, 7.43, -0.36, 5.29, -0.71, 6.50, 0.64, 3.79, 0.00]
      }, {
        name: 'Semana 2',
        data: [0.00, 6.61, -0.07, 5.79, -0.21, 5.50, 0.29, 5.93, 0.00]
      }, {
        name: 'Semana 3',
        data: [0.00, 6.54, -0.36, 5.18, -0.82, 8.79, -1.21, 4.64, 0.00]
      }, {
        name: 'Semana 4',
        data: [0.00, 7.18, -0.79, 5.68, -0.32, 6.50, -0.71, 5.29, 0.00]
      }]
    }

  }

}

function getMonthName(month_number){
  var month = new Array();
  month[0] = "Enero";
  month[1] = "Febrero";
  month[2] = "Marzo";
  month[3] = "Abril";
  month[4] = "Mayo";
  month[5] = "Junio";
  month[6] = "Julio";
  month[7] = "Agosto";
  month[8] = "Septiembre";
  month[9] = "Octubre";
  month[10] = "Noviembre";
  month[11] = "Diciembre";
  return month[month_number];
}

function getCurrentMonthData(useractivity: UserActivity){
  var d = new Date();
}

function weekCount(year, month_number) {

    // month_number is in the range 1..12

    var firstOfMonth = new Date(year, month_number-1, 1);
    var lastOfMonth = new Date(year, month_number, 0);

    var used = firstOfMonth.getDay() + 6 + lastOfMonth.getDate();

    return Math.ceil( used / 7);
}