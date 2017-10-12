import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ConsultarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consultar',
  templateUrl: 'consultar.html',
})
export class ConsultarPage {
  chartOptions: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Vibra Mes 1'
      },
      xAxis: {
        categories: ['Descanso', 'REM', 'Alimento', 'Cuerpo', 'Mente', 'Otros', 'Trabajo', 'Humanidad', 'Pareja']
      },
      yAxis: {
        title: {
          text: 'Salud Promedio'
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
