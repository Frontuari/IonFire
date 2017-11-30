import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
import { WhatDoIWant } from '../../models/what-do-i-want/what-do-i-want.interface';
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
  userActivityCharBarList$: FirebaseListObservable<UserActivity[]>;
  whatDoIWantList$: FirebaseListObservable<WhatDoIWant[]>;
  user = {} as UserModel;

  f_actual = new Date();

  filter = 'M';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private database: AngularFireDatabase) {

    let charData = [];
    let charLineData = [];
    let chartdata = [];

    this.afAuth.authState.subscribe(data => {
      this.user.uid = data.uid;

      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityCharBarList$ = this.database.list('user-activity')
        .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid == data.uid)) as FirebaseListObservable<UserActivity[]>;

      //  Build data for chart Line for Current Month
      this.userActivityCharBarList$.subscribe(
        userActivities => {
          userActivities.map(userActivity => {
            let d = new Date();
            let startDate = null;
            let endDate = null;
            if(this.filter == "M"){
              
              //endDate = new Date(d.getFullYear(), d.getMonth()+1, 0); 
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              startDate = date_by_subtracting_days(endDate, 28);
            } 
            else if(this.filter == "Y"){
              startDate = new Date(d.getFullYear(), 0, 1);
              endDate = new Date(d.getFullYear(), 11, 31); 
            }
            else{
              startDate = new Date(d.getFullYear()-3, d.getMonth(), d.getDate());
              endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            }
            if(validate_fechaBetween(userActivity.d_fecha,dateFormat(startDate),dateFormat(endDate)) == 1){
              charData.push({
                "name" : '¿Cómo Estoy?',
                //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
                "activities" : [
                  getHour(userActivity.d_suenho_descanso),
                  getHour(userActivity.d_alimento),
                  getHour(userActivity.d_yo_cuerpo),
                  getHour(userActivity.d_yo_mente),
                  getHour(userActivity.d_otros),
                  getHour(userActivity.d_trabajo),
                  getHour(userActivity.d_humanidad),
                  getHour(userActivity.d_pareja)
                ]
              });
            }
          })

          let res = alasql('SELECT name, ROUND(avg(activities -> 0),2) AS descanso, ROUND(avg(activities -> 1),2) AS alimento, \
          ROUND(avg(activities -> 2),2) AS yo_cuerpo, ROUND(avg(activities -> 3),2) AS yo_mente, ROUND(avg(activities -> 4),2) AS otros, \
          ROUND(avg(activities -> 5),2) AS trabajo, ROUND(avg(activities -> 6),2) AS humanidad, ROUND(avg(activities -> 7),2) AS pareja \
          FROM ? \
          GROUP BY name \
          ORDER BY name ASC',[charData]);
          //  Build array of object for chart
          for(let i = 0; i < res.length; i++){
            chartdata.push({
              name: res[i].name,
              type: 'column',
              data: [
                res[i].descanso,res[i].alimento,res[i].yo_cuerpo,res[i].yo_mente,
                res[i].otros,res[i].trabajo,res[i].humanidad,res[i].pareja
              ]
            })
          }

          let subtitle = "";
          switch(this.filter){
            case 'M':
              subtitle = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
              break;
            case 'Y':
              subtitle = 'Año '+this.f_actual.getFullYear();
              break;
            case 'T':
              subtitle = 'Triada desde '+(this.f_actual.getFullYear()-3)+' hasta '+this.f_actual.getFullYear();
              break;
          }
          //  Build Chart
          this.chartOptions = {
            chart: {
                zoomType: 'xy'
            },
            title: {
              text: '¿Que Quiero? / ¿Como Estoy?'
            },
            subtitle: {
              text: subtitle
            },
            xAxis: [{
              //, 'Salud'
              categories: ['Sueño', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad','Pareja'],
              labels: {
                formatter: function () {
                  switch(this.value){
                    case 'Sueño': 
                      return '<span style="fill: #442662;">' + this.value + '</span>';
                    case 'Alimento': 
                      return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                    case 'Cuerpo': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Mente': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Otros': 
                      return '<span style="fill: #FFD700;">' + this.value + '</span>';
                    case 'Trabajo': 
                      return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                    case 'Humanidad': 
                      return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                    case 'Pareja': 
                      return '<span style="fill: #E87B31;">' + this.value + '</span>';
                  }
                }
              },
              crosshair: true
            }],
            yAxis: [{
              min: 0,
              title: {
                text: 'Promedio',
                align: 'high'
              },
              labels: {
                overflow: 'justify'
              }
            }],
            tooltip: {
              shared: true,
              valueSuffix: ' horas'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 50,
                floating: true
            },
            credits: {
               enabled: false
            },
            series: chartdata
          }
        }
      );

      //  Pointing shoppingListRef$ at Firebase -> 'what-do-i-want' node
      this.whatDoIWantList$ = this.database.list('what-do-i-want')
          .map(_whatDoIWants => 
            _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == data.uid)) as FirebaseListObservable<WhatDoIWant[]>;

      this.whatDoIWantList$.subscribe(
        whatDoIWants => {
          if(whatDoIWants.length == 0){
            charLineData.push({
              "name" : '¿Qué Quiero?',
              //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
              "activities" : [0,0,0,0,0,0,0,0]
            })
          }
          else{
            whatDoIWants.map(whatDoIWant => {
              charLineData.push({
                "name" : '¿Qué Quiero?',
                //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
                "activities" : [
                  getHour(whatDoIWant.d_suenho_descanso),
                  getHour(whatDoIWant.d_alimento),
                  getHour(whatDoIWant.d_yo_cuerpo),
                  getHour(whatDoIWant.d_yo_mente),
                  getHour(whatDoIWant.d_otros),
                  getHour(whatDoIWant.d_trabajo),
                  getHour(whatDoIWant.d_humanidad),
                  getHour(whatDoIWant.d_pareja)
                ]
              })
            })
          }
          let rs = alasql('SELECT name, ROUND(avg(activities -> 0),2) AS descanso, ROUND(avg(activities -> 1),2) AS alimento, \
          ROUND(avg(activities -> 2),2) AS yo_cuerpo, ROUND(avg(activities -> 3),2) AS yo_mente, ROUND(avg(activities -> 4),2) AS otros, \
          ROUND(avg(activities -> 5),2) AS trabajo, ROUND(avg(activities -> 6),2) AS humanidad, ROUND(avg(activities -> 7),2) AS pareja \
          FROM ? \
          GROUP BY name \
          ORDER BY name ASC',[charLineData]);
          for(let i = 0; i < rs.length; i++){
            chartdata.push({
              name: rs[i].name,
              type: 'line',
              color: '#000000',
              data: [
                rs[i].descanso,rs[i].alimento,rs[i].yo_cuerpo,rs[i].yo_mente,
                rs[i].otros,rs[i].trabajo,rs[i].humanidad,rs[i].pareja
              ]
            })
          }

          let subtitle2 = "";
          switch(this.filter){
            case 'M':
              subtitle2 = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
              break;
            case 'Y':
              subtitle2 = 'Año '+this.f_actual.getFullYear();
              break;
            case 'T':
              subtitle2 = 'Triada desde '+(this.f_actual.getFullYear()-3)+' hasta '+this.f_actual.getFullYear();
              break;
          }

          //  Build Chart
          this.chartOptions = {
            chart: {
                zoomType: 'xy'
            },
            title: {
              text: '¿Qué Quiero? / ¿Cómo Estoy? '
            },
            subtitle: {
              text: subtitle2
            },
            xAxis: [{
              //, 'Salud'
              categories: ['Sueño', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad','Pareja'],
              labels: {
                formatter: function () {
                  switch(this.value){
                    case 'Sueño': 
                      return '<span style="fill: #442662;">' + this.value + '</span>';
                    case 'Alimento': 
                      return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                    case 'Cuerpo': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Mente': 
                      return '<span style="fill: #009D71;">' + this.value + '</span>';
                    case 'Otros': 
                      return '<span style="fill: #FFD700;">' + this.value + '</span>';
                    case 'Trabajo': 
                      return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                    case 'Humanidad': 
                      return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                    case 'Pareja': 
                      return '<span style="fill: #E87B31;">' + this.value + '</span>';
                  }
                }
              },
              crosshair: true
            }],
            yAxis: [{
              min: 0,
              title: {
                text: 'Promedio',
                align: 'high'
              },
              labels: {
                overflow: 'justify'
              }
            }],
            tooltip: {
              shared: true,
              valueSuffix: ' horas'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 80,
                verticalAlign: 'top',
                y: 50,
                floating: true
            },
            credits: {
               enabled: false
            },
            series: chartdata
          }

        }
      )
      //  End chart Line for Current Month
    });
  }

  onSelectChange(selectedValue: any) {
    this.filter = selectedValue;

    let charData = [];
    let charLineData = [];
    let chartdata = [];

    //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
    this.userActivityCharBarList$ = this.database.list('user-activity')
      .map(_userActivities => 
        _userActivities.filter(userActivity => userActivity.uid == this.user.uid)) as FirebaseListObservable<UserActivity[]>;

    //  Build data for chart Line for Current Month
    this.userActivityCharBarList$.subscribe(
      userActivities => {
        userActivities.map(userActivity => {
          let d = new Date();
          let startDate = null;
          let endDate = null;
          if(this.filter == "M"){
            startDate = new Date(d.getFullYear(), d.getMonth(), 1);
            endDate = new Date(d.getFullYear(), d.getMonth()+1, 0); 
          }
          else if(this.filter == "Y"){
            startDate = new Date(d.getFullYear(), 0, 1);
            endDate = new Date(d.getFullYear(), 11, 31); 
          }
          else{
            startDate = new Date(d.getFullYear()-3, d.getMonth(), d.getDate());
            endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          }
          if(validate_fechaBetween(userActivity.d_fecha,dateFormat(startDate),dateFormat(endDate)) == 1){
            charData.push({
              "name" : '¿Cómo Estoy?',
              //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
              "activities" : [
                getHour(userActivity.d_suenho_descanso),
                getHour(userActivity.d_alimento),
                getHour(userActivity.d_yo_cuerpo),
                getHour(userActivity.d_yo_mente),
                getHour(userActivity.d_otros),
                getHour(userActivity.d_trabajo),
                getHour(userActivity.d_humanidad),
                getHour(userActivity.d_pareja)
              ]
            });
          }
        })

        let res = alasql('SELECT name, ROUND(avg(activities -> 0),2) AS descanso, ROUND(avg(activities -> 1),2) AS alimento, \
        ROUND(avg(activities -> 2),2) AS yo_cuerpo, ROUND(avg(activities -> 3),2) AS yo_mente, ROUND(avg(activities -> 4),2) AS otros, \
        ROUND(avg(activities -> 5),2) AS trabajo, ROUND(avg(activities -> 6),2) AS humanidad, ROUND(avg(activities -> 7),2) AS pareja \
        FROM ? \
        GROUP BY name \
        ORDER BY name ASC',[charData]);
        //  Build array of object for chart
        for(let i = 0; i < res.length; i++){
          chartdata.push({
            name: res[i].name,
            type: 'column',
            data: [
              res[i].descanso,res[i].alimento,res[i].yo_cuerpo,res[i].yo_mente,
              res[i].otros,res[i].trabajo,res[i].humanidad,res[i].pareja
            ]
          })
        }

        let subtitle = "";
        switch(this.filter){
          case 'M':
            subtitle = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
            break;
          case 'Y':
            subtitle = 'Año '+this.f_actual.getFullYear();
            break;
          case 'T':
            subtitle = 'Triada desde '+(this.f_actual.getFullYear()-3)+' hasta '+this.f_actual.getFullYear();
            break;
        }
        //  Build Chart
        this.chartOptions = {
          chart: {
              zoomType: 'xy'
          },
          title: {
            text: '¿Que Quiero? / ¿Como Estoy?'
          },
          subtitle: {
            text: subtitle
          },
          xAxis: [{
            //, 'Salud'
            categories: ['Sueño', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad','Pareja'],
            labels: {
              formatter: function () {
                switch(this.value){
                  case 'Sueño': 
                    return '<span style="fill: #442662;">' + this.value + '</span>';
                  case 'Alimento': 
                    return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                  case 'Cuerpo': 
                    return '<span style="fill: #009D71;">' + this.value + '</span>';
                  case 'Mente': 
                    return '<span style="fill: #009D71;">' + this.value + '</span>';
                  case 'Otros': 
                    return '<span style="fill: #FFD700;">' + this.value + '</span>';
                  case 'Trabajo': 
                    return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                  case 'Humanidad': 
                    return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                  case 'Pareja': 
                    return '<span style="fill: #E87B31;">' + this.value + '</span>';
                }
              }
            },
            crosshair: true
          }],
          yAxis: [{
            min: 0,
            title: {
              text: 'Promedio',
              align: 'high'
            },
            labels: {
              overflow: 'justify'
            }
          }],
          tooltip: {
            shared: true,
            valueSuffix: ' horas'
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              x: 80,
              verticalAlign: 'top',
              y: 50,
              floating: true
          },
          credits: {
             enabled: false
          },
          series: chartdata
        }
      }
    );

    //  Pointing shoppingListRef$ at Firebase -> 'what-do-i-want' node
    this.whatDoIWantList$ = this.database.list('what-do-i-want')
        .map(_whatDoIWants => 
          _whatDoIWants.filter(whatDoIWant => whatDoIWant.uid == this.user.uid)) as FirebaseListObservable<WhatDoIWant[]>;

    this.whatDoIWantList$.subscribe(
      whatDoIWants => {
        if(whatDoIWants.length == 0){
          charLineData.push({
            "name" : '¿Qué Quiero?',
            //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
            "activities" : [0,0,0,0,0,0,0,0]
          })
        }
        else{
          whatDoIWants.map(whatDoIWant => {
            charLineData.push({
              "name" : '¿Qué Quiero?',
              //  ['Descanso', 'Salud', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
              "activities" : [
                getHour(whatDoIWant.d_suenho_descanso),
                getHour(whatDoIWant.d_alimento),
                getHour(whatDoIWant.d_yo_cuerpo),
                getHour(whatDoIWant.d_yo_mente),
                getHour(whatDoIWant.d_otros),
                getHour(whatDoIWant.d_trabajo),
                getHour(whatDoIWant.d_humanidad),
                getHour(whatDoIWant.d_pareja)
              ]
            })
          })
        }
        let rs = alasql('SELECT name, ROUND(avg(activities -> 0),2) AS descanso, ROUND(avg(activities -> 1),2) AS alimento, \
        ROUND(avg(activities -> 2),2) AS yo_cuerpo, ROUND(avg(activities -> 3),2) AS yo_mente, ROUND(avg(activities -> 4),2) AS otros, \
        ROUND(avg(activities -> 5),2) AS trabajo, ROUND(avg(activities -> 6),2) AS humanidad, ROUND(avg(activities -> 7),2) AS pareja \
        FROM ? \
        GROUP BY name \
        ORDER BY name ASC',[charLineData]);
        for(let i = 0; i < rs.length; i++){
          chartdata.push({
            name: rs[i].name,
            type: 'line',
            color: '#000000',
            data: [
              rs[i].descanso,rs[i].alimento,rs[i].yo_cuerpo,rs[i].yo_mente,
              rs[i].otros,rs[i].trabajo,rs[i].humanidad,rs[i].pareja
            ]
          })
        }

        let subtitle2 = "";
        switch(this.filter){
          case 'M':
            subtitle2 = getMonthName(this.f_actual.getMonth())+ " "+this.f_actual.getFullYear();
            break;
          case 'Y':
            subtitle2 = 'Año '+this.f_actual.getFullYear();
            break;
          case 'T':
            subtitle2 = 'Triada desde '+(this.f_actual.getFullYear()-3)+' hasta '+this.f_actual.getFullYear();
            break;
        }

        //  Build Chart
        this.chartOptions = {
          chart: {
              zoomType: 'xy'
          },
          title: {
            text: '¿Qué Quiero? / ¿Cómo Estoy? '
          },
          subtitle: {
            text: subtitle2
          },
          xAxis: [{
            //, 'Salud'
            categories: ['Sueño', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad','Pareja'],
            labels: {
              formatter: function () {
                switch(this.value){
                  case 'Sueño': 
                    return '<span style="fill: #442662;">' + this.value + '</span>';
                  case 'Alimento': 
                    return '<span style="fill: #0CB7F2;">' + this.value + '</span>';
                  case 'Cuerpo': 
                    return '<span style="fill: #009D71;">' + this.value + '</span>';
                  case 'Mente': 
                    return '<span style="fill: #009D71;">' + this.value + '</span>';
                  case 'Otros': 
                    return '<span style="fill: #FFD700;">' + this.value + '</span>';
                  case 'Trabajo': 
                    return '<span style="fill: #CB1D11;">' + this.value + '</span>';
                  case 'Humanidad': 
                    return '<span style="fill: #C0C0C0;">' + this.value + '</span>';
                  case 'Pareja': 
                    return '<span style="fill: #E87B31;">' + this.value + '</span>';
                }
              }
            },
            crosshair: true
          }],
          yAxis: [{
            min: 0,
            title: {
              text: 'Promedio',
              align: 'high'
            },
            labels: {
              overflow: 'justify'
            }
          }],
          tooltip: {
            shared: true,
            valueSuffix: ' horas'
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              x: 80,
              verticalAlign: 'top',
              y: 50,
              floating: true
          },
          credits: {
             enabled: false
          },
          series: chartdata
        }

      }
    )
    //  End chart Line for Current Month
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
  var dateCompare=Number(valuesCompare[0]+(valuesCompare[1]<10 ? '0'+valuesCompare[1] : valuesCompare[1])+(valuesCompare[2]<10 ? '0'+valuesCompare[2] : valuesCompare[2]));
  var dateStart=Number(valuesStart[0]+(valuesStart[1]<10 ? '0'+valuesStart[1] : valuesStart[1])+(valuesStart[2]<10 ? '0'+valuesStart[2] : valuesStart[2]));
  var dateEnd=Number(valuesEnd[0]+(valuesEnd[1]<10 ? '0'+valuesEnd[1] : valuesEnd[1])+(valuesEnd[2]<10 ? '0'+valuesEnd[2] : valuesEnd[2]));
  if(dateCompare>=dateStart && dateCompare <=dateEnd)
  {
      return 1;
  }
  return 0;
}

function dateFormat(fecha){
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var yyyy = fecha.getFullYear();
  var fecha_formateada = yyyy + '-' + mes + '-' + dia;
  return fecha_formateada;
}

function getHour(concept){
  let totalHour = Number(concept.slice(11,13));
  let totalMin = Number(concept.slice(14,16));

  return totalHour + (totalMin / 60);
}

function date_by_subtracting_days(date, days) {
  return new Date(
      date.getFullYear(), 
      date.getMonth(), 
      date.getDate() - days
   );
}