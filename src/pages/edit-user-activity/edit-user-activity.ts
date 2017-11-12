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
      subTitle: 'Cuanto tiempo ha dedicado a dormir, sueño profundo durante la noche o el día.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressAlimento(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Alimento',
      subTitle: 'Cuanto tiempo ha dedicado a preparar y comer tus alimentos.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressOtros(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Otros',
      subTitle: 'Cuanto tiempo ha dedicado a compartir, reir e incluso abrazar a otros.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressTrabajo(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Trabajo',
      subTitle: 'Cuanto horas o minutos le estas dedicando al trabajo.',
      buttons: ['OK']
    });
    alert.present();
  }

  pressHumanidad(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Humanidad',
      subTitle: 'Cuanto horas o minutos dedicas a la humanidad.',
      buttons: ['OK']
    });
    alert.present();
  }
  
  pressPareja(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Pareja',
      subTitle: 'Cuanto horas o minutos dedicas a tu pareja.',
      buttons: ['OK']
    });
    alert.present();
  }
  
  pressCuerpo(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: ' Yo Cuerpo',
      subTitle: 'Cuanto horas o minutos dedicas a ejercitarte, correr, Yoga.',
      buttons: ['OK']
    });
    alert.present();
  }
  
  pressMente(e) {
    //this.press++
    let alert = this.alertCtrl.create({
      title: 'Yo Mente',
      subTitle: 'Cuanto horas o minutos dedicas a la lectura aprender cosas nuevas durante el dia.',
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
