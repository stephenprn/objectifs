import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AutoCompleteModule } from '@componentsPRN/ionic2-auto-complete';
import { ProgressBarComponent } from '@componentsPRN/progressBar/progressBar';
import { weekStatsHomeComponent } from '@componentsPRN/weekStatsHome/weekStatsHome';
import { DatePicker } from '@ionic-native/date-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { AddObjectifPage } from '@pagesPRN/addObjectif/addObjectif';
import { ObjectifsPage } from '@pagesPRN/objectifs/objectifs';
import { WeekStatsPage } from '@pagesPRN/weekStats/weekStats';
import { DateService } from '@servicesPRN/date.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { ObjectifsLaterService } from '@servicesPRN/objectifsLater.service';
import { StatsService } from '@servicesPRN/stats.service';
import { SuggestionsService } from '@servicesPRN/suggestions.service';
import { UtilsService } from '@servicesPRN/utils.service';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { UiService } from '@servicesPRN/ui.service';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        MyApp,
        ObjectifsPage,
        AddObjectifPage,
        WeekStatsPage,
        ProgressBarComponent,
        weekStatsHomeComponent
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
        UiService,
        DateService,
        DatePicker,
        { provide: LOCALE_ID, useValue: 'fr' }
    ]
})
export class AppModule { }
