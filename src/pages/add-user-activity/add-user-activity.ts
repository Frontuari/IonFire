import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//	Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
//  Imports UserModels and AuthService
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import for orderby data from Angular
import "rxjs/add/operator/map";

@Component({
  selector: 'page-add-user-activity',
  templateUrl: 'add-user-activity.html',
})
export class AddUserActivityPage {
  //	Create a new UserActivity Object
  userActivity = {
    d_suenho_descanso: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_salud: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_alimento: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_yo_cuerpo: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_yo_mente: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_otros: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_trabajo: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_humanidad: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    d_pareja: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00"
  } as UserActivity;
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
      if(data && data.uid && data.displayName){
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
    let totalHours = sumarHoras(userActivity);

    if(totalHours > 24){
      this.toast.create({
        message:'El total de horas distribuidas ('+totalHours+') no puede ser mayor a 24',
        duration:3000
      }).present();
    }
    else{
      this.userActivityList$ = this.database.list('user-activity')
      .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid_fecha == this.user.uid+'_'+this.myDate)) as FirebaseListObservable<UserActivity[]>;;
      console.log(this.userActivityList$);
      //  Push this to our Firebase database under the 'user-activity' node.
      this.userActivityRef$.push({
        uid: this.user.uid,
        d_suenho_descanso: this.userActivity.d_suenho_descanso,
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

}

function getCurDate(fecha,dias,operando){
  if(operando == '+')
    fecha.setDate(fecha.getDate() + dias);
  else
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
}

function sumarMinutos(userActivity: UserActivity){
  let totalMin = 0;
  totalMin = Number(userActivity.d_suenho_descanso.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_salud.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_alimento.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_yo_cuerpo.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_yo_mente.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_otros.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_trabajo.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_humanidad.slice(14,16));
  totalMin = totalMin + Number(userActivity.d_pareja.slice(14,16));

  totalMin = totalMin / 60;
  return totalMin;
}

function sumarHoras(userActivity: UserActivity){ 
  let totalMin = sumarMinutos(userActivity);
  let totalHoras = 0;
  totalHoras = Number(userActivity.d_suenho_descanso.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_salud.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_alimento.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_yo_cuerpo.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_yo_mente.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_otros.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_trabajo.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_humanidad.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_pareja.slice(11,13));

  return totalHoras + totalMin;
}