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
//  Import AlaSQL
import * as alasql from 'alasql';

@Component({
  selector: 'page-chart-pie',
  templateUrl: 'chart-pie.html',
})
export class ChartPiePage {
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

    let charData = [];

    this.afAuth.authState.subscribe(data => {
      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityList$ = this.database.list('user-activity')
        .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

      //  Build data for chart Line for Current Month
      this.userActivityList$.subscribe(
        userActivities => {
          let i = 0;
          userActivities.map(userActivity => {
            let d = new Date();
            let firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            let lastOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            let weekNumber = 0;
            if(validate_fechaBetween(userActivity.d_fecha,dateFormat(firstOfMonth),dateFormat(lastOfMonth)) == 1){
              //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
              charData.push({
                "name" : 'Descanso',
                "y" : getHour(userActivity.d_suenho_descanso)
              });
              charData.push({
                "name" : 'Salud',
                "y" : getHour(userActivity.d_salud)
              });
              charData.push({
                "name" : 'Alimento',
                "y" : getHour(userActivity.d_alimento)
              });
              charData.push({
                "name" : 'Cuerpo',
                "y" : getHour(userActivity.d_yo_cuerpo)
              });
              charData.push({
                "name" : 'Mente',
                "y" : getHour(userActivity.d_yo_mente)
              });
              charData.push({
                "name" : 'Otros',
                "y" : getHour(userActivity.d_otros)
              });
              charData.push({
                "name" : 'Trabajo',
                "y" : getHour(userActivity.d_trabajo)
              });
              charData.push({
                "name" : 'Humanidad',
                "y" : getHour(userActivity.d_humanidad)
              });
              charData.push({
                "name" : 'Pareja',
                "y" : getHour(userActivity.d_pareja)
              });
            }
          })

          let res = alasql('SELECT name, sum(y) AS y \
          FROM ? \
          GROUP BY name \
          ORDER BY sum(y) ASC',[charData]);

          //  Build Chart
          this.chartOptions = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
            },
            title: {
              text: 'Distribución '+getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear()
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false
                },
                showInLegend: true
              }
            },
            credits: {
               enabled: false
            },
            series: [{
              name: '% Total',
              colorByPoint: true,
              data: res
            }]
          }
        }
      );
      //  End chart Line for Current Month
    });
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

function validate_fechaBetween(fecha,fechaInicial,fechaFinal)
{
  let valuesCompare=fecha.split("-");
  let valuesStart=fechaInicial.split("-");
  let valuesEnd=fechaFinal.split("-");
  // Verificamos que la fecha no sea posterior a la actual
  var dateCompare=new Date(valuesCompare[2],(valuesCompare[1]-1),valuesCompare[0]);
  var dateStart=new Date(valuesStart[2],(valuesStart[1]-1),valuesStart[0]);
  var dateEnd=new Date(valuesEnd[2],(valuesEnd[1]-1),valuesEnd[0]);
  if(dateCompare>=dateStart && dateCompare <=dateEnd)
  {
      return 1;
  }
  return 0;
}

function dateFormat(fecha){
  var dia = fecha.getDate();
  var mes = fecha.getMonth();
  var yyyy = fecha.getFullYear();
  var fecha_formateada = yyyy + '-' + mes + '-' + dia;
  return fecha_formateada;
}

function getHour(concept){
  let totalHour = Number(concept.slice(11,13));
  let totalMin = Number(concept.slice(14,16));

  return totalHour + (totalMin / 60);
}

function isEmptyObject(obj) {
  return (obj && (Object.keys(obj).length === 0));
}