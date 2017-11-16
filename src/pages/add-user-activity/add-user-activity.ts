import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
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


      //Ayuda de cada item
  //public press: number = 0;

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
      subTitle: 'Actividades relacionadas con la comida: Cocina, siembra, mercado, medicina, etc',
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
  userActivity = {
    d_suenho_descanso: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
    //d_salud: getCurDate(new Date(),0,'+').toISOString().slice(0,11)+"00:00",
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
    public alertCtrl: AlertController,
    private authService: AuthService,
  	private database: AngularFireDatabase) {
  	this.userActivityRef$ = this.database.list('user-activity');
    this.afAuth.authState.subscribe(data => {
      if(data && data.uid){
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
    let i = 0;
    if(totalHours > 24){
      this.toast.create({
        message:'El total de horas distribuidas ('+totalHours+') no puede ser mayor a 24',
        duration:3000
      }).present();
    }
    else{
      this.userActivityList$ = this.database.list('user-activity')
      .map(_userActivities => 
          _userActivities.filter(userActivity => userActivity.uid_fecha == this.user.uid+'_'+this.myDate)) as FirebaseListObservable<UserActivity[]>;
      //  Check if data exists
      this.userActivityList$.subscribe(
        userActivities => {
          if(userActivities.length > 0){
            if(i==0){
              this.toast.create({
                message:'No es posible registrar la actividad porque ya existe una actividad para el día seleccionado',
                duration:3000
              }).present(); 
            }
            i++;
          }else{
            //  Push this to our Firebase database under the 'user-activity' node.
            this.userActivityRef$.push({
              uid: this.user.uid,
              d_suenho_descanso: this.userActivity.d_suenho_descanso,
              //d_salud: this.userActivity.d_salud,
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
            i++;
            //  Reset our userActivity
            this.userActivity = {} as UserActivity;
            //  Navigate the user back to the AyerPage
            this.navCtrl.pop();
          }
        }
      );
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
  totalHoras = totalHoras + Number(userActivity.d_alimento.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_yo_cuerpo.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_yo_mente.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_otros.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_trabajo.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_humanidad.slice(11,13));
  totalHoras = totalHoras + Number(userActivity.d_pareja.slice(11,13));

  return totalHoras + totalMin;
}