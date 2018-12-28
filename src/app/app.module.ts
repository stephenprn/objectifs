import { UtilsService } from './../services/utils.service';
import { ObjectifsPage } from './../pages/objectifs/objectifs';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Firebase } from '@ionic-native/firebase';
import { IonicStorageModule } from '@ionic/storage';
import { DatePicker } from '@ionic-native/date-picker';
import { AutoCompleteModule } from 'ionic2-auto-complete';

import { MyApp } from './app.component';
import { ObjectifsService } from '../services/objectifs.service';
import { AddObjectifPage } from '../pages/addObjectif/addObjectif';
import { SuggestionsService } from '../services/suggestions.service';
import { DateService } from '../services/date.service';
import { StatsService } from '../services/stats.service';
import { ObjectifsLaterService } from '../services/objectifsLater.service';
import { WeekStatsPage } from '../pages/weekStats/weekStats';


@NgModule({
    declarations: [
        MyApp,
        ObjectifsPage,
        AddObjectifPage,
        WeekStatsPage
    ],
    imports: [
        BrowserModule,
        AutoCompleteModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ObjectifsPage,
        AddObjectifPage,
        WeekStatsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ObjectifsService,
        ObjectifsLaterService,
        SuggestionsService,
        StatsService,
        UtilsService,
        DateService,
        DatePicker,
        Firebase
    ]
})
export class AppModule { }
