import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProgressBarComponent } from '@componentsPRN/progress-bar/progress-bar.component';
import { weekStatsHomeComponent } from '@componentsPRN/week-stats-home/week-stats-home.component';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { AddObjectifPage } from '@pagesPRN/add-objectif/add-objectif.page';
import { ObjectifsPage } from '@pagesPRN/objectifs/objectifs.page';
import { StatsPage } from '@pagesPRN/stats/stats.page';
import { WeekStatsPage } from '@pagesPRN/stats/week-stats/week-stats.page';
import { AchievementsService } from '@servicesPRN/achievements.service';
import { DateService } from '@servicesPRN/date.service';
import { NotificationsService } from '@servicesPRN/notifications.service';
import { ObjectifsLaterService } from '@servicesPRN/objectifs-later.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { StatsService } from '@servicesPRN/stats.service';
import { SuggestionsService } from '@servicesPRN/suggestions.service';
import { UiService } from '@servicesPRN/ui.service';
import { UtilsService } from '@servicesPRN/utils.service';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { SettingsPage } from '@pagesPRN/settings/settings.page';
import { SettingsService } from '@servicesPRN/settings.service';
import { PasswordPage } from '@pagesPRN/password/password.page';
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { GeneralStatsPage } from '@pagesPRN/stats/general-stats/general-stats.page';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        MyApp,
        ObjectifsPage,
        PasswordPage,
        StatsPage,
        WeekStatsPage,
        GeneralStatsPage,
        AddObjectifPage,
        SettingsPage,
        ProgressBarComponent,
        weekStatsHomeComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp, {
            scrollPadding: true
        }),
        AutoCompleteModule,
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ObjectifsPage,
        PasswordPage,
        StatsPage,
        GeneralStatsPage,
        WeekStatsPage,
        AddObjectifPage,
        SettingsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AchievementsService,
        ObjectifsService,
        SettingsService,
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
