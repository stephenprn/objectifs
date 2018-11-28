import { ObjectifsPage } from './../pages/objectifs/objectifs';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { ObjectifsService } from '../services/objectifs.service';
import { AddObjectifPage } from '../pages/addObjectif/addObjectif';
import { SuggestionsService } from '../services/suggestions.service';
import { DateService } from '../services/date.service';

@NgModule({
  declarations: [
    MyApp,
    ObjectifsPage,
    AddObjectifPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ObjectifsPage,
    AddObjectifPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ObjectifsService,
    SuggestionsService,
    DateService,
    DatePicker
  ]
})
export class AppModule {}
