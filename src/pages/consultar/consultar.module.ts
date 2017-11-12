import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsultarPage } from './consultar';

@NgModule({
  declarations: [
    ConsultarPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultarPage),
  ],
})
export class ConsultarPageModule {}
