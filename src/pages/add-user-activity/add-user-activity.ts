import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//	Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
//  Imports UserModels and AuthService
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';

@Component({
  selector: 'page-add-user-activity',
  templateUrl: 'add-user-activity.html',
})
export class AddUserActivityPage {
  //	Create a new UserActivity Object
  userActivity = {} as UserActivity;
  user = {} as UserModel;
  //	Create a new FirebaseListObservable Object
  userActivityRef$: FirebaseListObservable<UserActivity[]>
  userActivityList$: FirebaseListObservable<UserActivity[]>

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private toast: ToastController,
    private authService: AuthService,
  	private database: AngularFireDatabase) {
  	this.userActivityRef$ = this.database.list('user-activity');
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.displayName){
        this.user.email = data.email;
        this.user.name = data.displayName;
        this.user.photoURL = data.photoURL;
        this.user.uid = data.uid;
      }else{
        this.toast.create({
          message:'No se pudo encontrar detalles de autenticación',
          duration:3000
        }).present();
      }
    });
  }

  myDate: String = getCurDate(new Date(),0,'+').toISOString().slice(0, 10);
  minDate: String = getCurDate(new Date(),2,'-').toISOString().slice(0, 10);
  maxDate: String = getCurDate(new Date(),1,'+').toISOString().slice(0, 10);

  UserActivity(userActivity: UserActivity){
    //  Push this to our Firebase database under the 'user-activity' node.
    this.userActivityRef$.push({
      uid: this.user.uid,
      d_suenho_descanso: this.userActivity.d_suenho_descanso,
      d_suenho_rem: this.userActivity.d_suenho_rem,
      d_salud: this.userActivity.d_salud,
      d_alimento: this.userActivity.d_alimento,
      d_yo_cuerpo: this.userActivity.d_yo_cuerpo,
      d_yo_mente: this.userActivity.d_yo_mente,
      d_otros: this.userActivity.d_otros,
      d_trabajo: this.userActivity.d_trabajo,
      d_humanidad: this.userActivity.d_humanidad,
      d_pareja: this.userActivity.d_pareja,
      d_fecha: this.myDate,
      uid_fecha: this.user.uid+'_'+this.myDate
    });
    //  Reset our userActivity
    this.userActivity = {} as UserActivity;
    //  Navigate the user back to the AyerPage
    this.navCtrl.pop();
  }

}

function getCurDate(fecha,dias,operando){
  if(operando == '+')
    fecha.setDate(fecha.getDate() + dias);
  else
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}
