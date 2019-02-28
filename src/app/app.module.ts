import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AutoCompleteModule } from '@componentsPRN/ionic2-auto-complete';
import { ProgressBarComponent } from '@componentsPRN/progressBar/progressBar';
import { weekStatsHomeComponent } from '@componentsPRN/weekStatsHome/weekStatsHome';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { AddObjectifPage } from '@pagesPRN/addObjectif/addObjectif';
import { ObjectifsPage } from '@pagesPRN/objectifs/objectifs';
import { StatsPage } from '@pagesPRN/stats/stats';
import { DateService } from '@servicesPRN/date.service';
import { NotificationsService } from '@servicesPRN/notifications.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { ObjectifsLaterService } from '@servicesPRN/objectifsLater.service';
import { StatsService } from '@servicesPRN/stats.service';
import { SuggestionsService } from '@servicesPRN/suggestions.service';
import { UiService } from '@servicesPRN/ui.service';
import { UtilsService } from '@servicesPRN/utils.service';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { WeekStatsPage } from '@pagesPRN/stats/weekStats/weekStats';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        MyApp,
        ObjectifsPage,
        StatsPage,
        WeekStatsPage,
        AddObjectifPage,
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
        StatsPage,
        WeekStatsPage,
        AddObjectifPage
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
        Keyboard,
        NotificationsService,
        LocalNotifications,
        { provide: LOCALE_ID, useValue: 'fr' },
        { provide: ErrorHandler, useClass: ErrorHandler }
    ]
})
export class AppModule { }
