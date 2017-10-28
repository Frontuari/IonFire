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
  selector: 'page-chart-bar',
  templateUrl: 'chart-bar.html',
})
export class ChartBarPage {
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
              let nameSerie = getHour(userActivity.d_pareja)==0 ? 'Sin Pareja' : 'Con Pareja';
              charData.push({
                "name" : nameSerie,
                //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
                "activities" : [
                  getHour(userActivity.d_suenho_descanso),
                  getHour(userActivity.d_salud),
                  getHour(userActivity.d_alimento),
                  getHour(userActivity.d_yo_cuerpo),
                  getHour(userActivity.d_yo_mente),
                  getHour(userActivity.d_otros),
                  getHour(userActivity.d_trabajo),
                  getHour(userActivity.d_humanidad)
                ]
              });
            }
          })

          let res = alasql('SELECT name, sum(activities -> 0) AS descanso, sum(activities -> 1) AS salud, sum(activities -> 2) AS alimento, \
          sum(activities -> 3) AS yo_cuerpo, sum(activities -> 4) AS yo_mente, sum(activities -> 5) AS otros, sum(activities -> 6) AS trabajo, \
          sum(activities -> 7) AS humanidad \
          FROM ? \
          GROUP BY name \
          ORDER BY name ASC',[charData]);

          //  Build array of object for chart
          let chartdata = [];
          for(let i = 0; i < res.length; i++){
            chartdata.push({
              name: res[i].name,
              data: [
                res[i].descanso,res[i].salud,res[i].alimento,res[i].yo_cuerpo,res[i].yo_mente,
                res[i].otros,res[i].trabajo,res[i].humanidad,res[i].pareja,
              ]
            })
          }
          //  Build Chart
          this.chartOptions = {
            chart: {
              type: 'bar'
            },
            title: {
              text: 'Con/Sin Pareja '+getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear()
            },
            xAxis: {
              categories: ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad']
            },
            yAxis: {
               min: 0,
               title: {
                  text: 'Total Horas',
                  align: 'high'
               },
               labels: {
                  overflow: 'justify'
               }
            },
            tooltip: {
               valueSuffix: ' horas'
            },
            plotOptions: {
               bar: {
                  dataLabels: {
                     enabled: true
                  }
               }
            },
            credits: {
               enabled: false
            },
            series: chartdata
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