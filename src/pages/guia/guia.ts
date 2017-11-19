import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-guia',
  templateUrl: 'guia.html',
})
export class GuiaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  slides = [
    {
      title: "ANDDANDO TE DA LA BIENVENIDA",
      description: "Descubre cómo organizar tu vida de manera equilibrada",
      image: "assets/images/ANDDANDOMK600.png",
      width:"240",
      height:"188",
    },
    {      
      title: "¿QUÉ HACES TODOS LOS DÍAS ?",
      description: "Registra tus actividades diarias relacionadas con estas 7 categorías: Sueño, Alimento, Yo -Cuerpo y Mente-, Otros, Trabajo, Humanidad y Pareja. Asegúrate de incluir todo lo que haces a diario. incluyendo aquellas actividades que para ti podrían ocupar más de una categoría, lo importante es que seas consciente de lo que estás haciendo y seas tú quien lo decida.",
      image: "assets/images/24-7.png",
      width:"100",
      height:"100",
    },
    {
      title: "24 HORAS PARA SER HUMANO",
      description: "Ingresa la cantidad de tiempo que inviertes durante el día a cada una estas actividades. Hazlo cada vez que finalices cualquier actividad, antes de dormir o de acuerdo a tus posibilidades. ¡Sólo te llevará 5 minutos!",
      image: "assets/images/24HorasSerHumanos.jpg",
      width:"150",
      height:"150",
    },
    {
      title: "¿CÓMO ESTOY ?",
      description: "¡Conoce de manera gráfica la forma en la que vives a partir de lo que haces durante las 24 horas del día! <br />Observa cuáles son tus prioridades, a qué actividades dedicas más o menos horas al día y los posibles desequilibrios que puedan surgir a causa de cualquier distribución desproporcionada.",
      image: "assets/images/Grafica2.png",
      width:"240",
      height:"135",
    }
  ];

  irHome() {
    this.navCtrl.setRoot(HomePage);
  }

}
