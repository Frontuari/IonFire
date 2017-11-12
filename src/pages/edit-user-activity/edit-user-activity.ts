import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseObjectObservable
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
//	Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
//  Imports UserModels and AuthService
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'page-edit-user-activity',
  templateUrl: 'edit-user-activity.html',
})
export class EditUserActivityPage {

  pressSueno(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Sueño',
      subTitle: 'Actividades relacionadas con dormir: Soñar, conciliar el sueño, tomar una siesta, etc.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressAlimento(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Alimento',
      subTitle: 'Actividades relacionadas con la comida: Cocina, siembra, mercado, medicina, etc.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressOtros(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Otros',
      subTitle: 'Actividades dedicadas a las relaciones humanas: Hablar con otros, familia, amigos, conocer nuevas personas, etc.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressTrabajo(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Trabajo',
      subTitle: 'Actividades que impliquen un esfuerzo productivo: Tareas domésticas, empleo, estudio, etc.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressHumanidad(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Humanidad',
      subTitle: 'Actos que te recuerden que eres un ser humano: Observar la naturaleza, ayudar al otro, orar o meditar, caminar, viajar, etc.',
      buttons: ['OK']
    });
    alert.present();
  }
  
  pressPareja(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Pareja',
      subTitle: 'Actividades que realizas con quien compartes todo en tu vida. Asimismo, escuchar, intimar, resolver problemas, etc.',
      buttons: ['OK']
    });
    alert.present();
  }
  
  pressCuerpo(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: ' Yo Cuerpo',
      subTitle: 'Actividades relacionadas con el bienestar corporal: Ejercicio, salud, higiene, etc.',
      buttons: ['OK']
    });
    alert.present();
  }
  
  pressMente(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Yo Mente',
      subTitle: 'Actividades para ejercitar el cerebro y la memoria: Leer, aprender un idioma, música, ocio, etc.',
      buttons: ['OK']
    });
    alert.present();
  }


  //	Create a new UserActivity Object
  userActivity = {} as UserActivity;
  user = {} as UserModel;
  //	Create a new FirebaseObjectObservable Object
  userActivityRef$: FirebaseObjectObservable<UserActivity>

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,    
  	private database: AngularFireDatabase) {
  	const userActivityId = this.navParams.get('userActivityId');
  	this.userActivityRef$ = this.database.object(`user-activity/${userActivityId}`);
  	this.userActivityRef$.subscribe(userActivity => this.userActivity = userActivity);
  }

  //  Update our Firebase node with new item data
  EditUserActivity(userActivity: UserActivity){
    userActivity.uid_fecha = userActivity.uid+'_'+userActivity.d_fecha;
    this.userActivityRef$.update(userActivity);
    //  Send the user back to ShoppingListPage
    this.navCtrl.pop();
  }

}
