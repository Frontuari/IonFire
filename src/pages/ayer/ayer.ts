import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
//  Import AngularFireDatabase and FirebaseListObservable
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//  Imports UserActivity Interface
import { UserActivity } from '../../models/user-activity/user-activity.interface';
//  Imports UserModels and AuthService
import { AuthService } from '../../providers/auth-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserModel } from '../../models/user-model';
//  Import AddUserActivityPage and EditUserActivityPage
import { AddUserActivityPage } from '../add-user-activity/add-user-activity';
import { EditUserActivityPage } from '../edit-user-activity/edit-user-activity';

@IonicPage()
@Component({
  selector: 'page-ayer',
  templateUrl: 'ayer.html',
})
export class AyerPage {
  userActivityList$: FirebaseListObservable<UserActivity[]>;
  user = {} as UserModel;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public afAuth: AngularFireAuth,
    private actionSheetCtrl: ActionSheetController,
  	private database: AngularFireDatabase) {
    this.afAuth.authState.subscribe(data => {
      //  Pointing shoppingListRef$ at Firebase -> 'user-activity' node
      this.userActivityList$ = this.database.list('user-activity');
    });
  }

  myDate: String = getCurDate(new Date(),1,'-').toISOString();

  AddUserActivity(){
    //  Navigate the user to the AddUserActivity
    this.navCtrl.push(AddUserActivityPage);
  }

  selectUserActivity(userActivity: UserActivity){
    this.actionSheetCtrl.create({
      title: `Editar ${userActivity.d_fecha}`,
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            //  Send the user to the EditShoppingPage and pass the key as parameter
            this.navCtrl.push(EditUserActivityPage, { userActivityId: userActivity.$key });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("The user has selected the cancel button");
          }
        }]
    }).present();
  }

}

function Ctrl($scope)
{
    $scope.date = new Date();
}

function getCurDate(fecha,dias,operando){
	if(operando == '+')
		fecha.setDate(fecha.getDate() + dias);
	else
		fecha.setDate(fecha.getDate() - dias);
  	return fecha;
}