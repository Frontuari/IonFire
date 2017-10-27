import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
      title: "Bienvenido...",
      description: "Anddando <b>Te Permitira</b> Medir tus Actividades diarias, y de esta manera lograr conocer el equilibrio ideal. dale un vistaso al uso de Anddando",
      image: "../../assets/images/guia-rapida.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "../../assets/images/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "../../assets/images/ica-slidebox-img-3.png",
    }
  ];

  irHome() {
    this.navCtrl.setRoot(HomePage);
  }

}
