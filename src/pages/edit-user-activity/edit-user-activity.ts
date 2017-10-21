import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  //	Create a new UserActivity Object
  userActivity = {} as UserActivity;
  user = {} as UserModel;
  //	Create a new FirebaseObjectObservable Object
  userActivityRef$: FirebaseObjectObservable<UserActivity>

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
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
