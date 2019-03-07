import { AchievementType } from '@enumsPRN/achievement-type.enum';
import { Achievement } from '@modelsPRN/achievement.model';
import { Category } from '@modelsPRN/category.model';
import { CustomDayPeriodicity } from '@modelsPRN/custom-day-periodicity.model';
import { CustomPeriodicity } from '@modelsPRN/custom-periodicity.model';
import { Importance } from '@modelsPRN/importance.model';
import { Periodicity } from '@modelsPRN/periodicity.model';
import { ToastOptions } from 'ionic-angular';
import { DatePickerOptions } from '@ionic-native/date-picker';

export class AppConstants {
    public static storageNames: any = {
        id: {
            base: 'id',
            periodic: 'idPeriodic',
            later: 'idLater'
        },
        objectif: {
            base: 'objectifs',
            later: 'objectifsLater',
            periodic: 'objectifsPeriodic'
        },
        suggestion: {
            category: 'categoriesUsages',
            suggestion: 'suggestions'
        },
        achievements: 'achievements'
    };

    public static colors: any = {
        red: '#F44336',
        orange: '#FF9800',
        black: '#000000',
        green: '#4CAF50',
        blue: '#1976D2',
        yellow: '#FFEB3B',
        purple: '#6200EE'
    };

    public static categories: Category[] = [
        { id: 'health', title: 'santé', icon: 'medkit', color: AppConstants.colors.red },
        { id: 'relational', title: 'relationnel', icon: 'happy', color: AppConstants.colors.orange },
        { id: 'professional', title: 'professionnel', icon: 'briefcase', color: AppConstants.colors.purple },
        { id: 'financial', title: 'financier', icon: 'cash', color: AppConstants.colors.green },
        { id: 'spiritual', title: 'spirituel', icon: 'eye', color: AppConstants.colors.blue },
        { id: 'other', title: 'autre', icon: 'bulb', color: AppConstants.colors.yellow }
    ];

    public static importances: Importance[] = [
        { id: 'low', title: 'minime', icon: 'arrow-down', color: AppConstants.colors.green, index: 0 },
        { id: 'medium', title: 'moyenne', icon: 'arrow-forward', color: AppConstants.colors.orange, index: 1, selected: true },
        { id: 'high', title: 'haute', icon: 'arrow-up', color: AppConstants.colors.red, index: 2 }
    ];

    public static periodicities: Periodicity[] = [
        { id: 'punctual', title: 'jamais' },
        { id: 'daily', title: 'tous les jours' },
        { id: 'weekly', title: 'toutes les semaines' },
        { id: 'monthly', title: 'tous les mois' },
        { id: 'customDays', title: 'choisir les jours' },
        { id: 'custom', title: 'personnalisé' }
    ];

    public static initialPeriodicity: string = 'punctual';
    
    public static customPeriodicities: Periodicity[] = [
        { id: 'daily', title: 'jours', every: 'Tous les ' },
        { id: 'weekly', title: 'semaines', every: 'Toutes les ' },
        { id: 'monthly', title: 'mois', every: 'Tous les ' }
    ];

    // The ids corresponds to the number returned by js date.getDay()
    public static customDaysPeriodicities: CustomDayPeriodicity[] = [
        { id: 1, title: 'lun', selected: false },
        { id: 2, title: 'mar', selected: false },
        { id: 3, title: 'mer', selected: false },
        { id: 4, title: 'jeu', selected: false },
        { id: 5, title: 'ven', selected: false },
        { id: 6, title: 'sam', selected: false },
        { id: 0, title: 'dim', selected: false }
    ];

    // The text is generated in addObjectifComponent
    public static initialCustomPeriodicity: CustomPeriodicity = {
        number: 7,
        type: 'daily',
        text: null
    };

    public static limitNbrPeriodicity: number = 366;

    public static progressBarColors: {value: number, color: string}[] = [
        { value: 10, color: AppConstants.colors.red },
        { value: 20, color: '#F66D37' },
        { value: 30, color: '#F99738' },
        { value: 40, color: '#FCC139' },
        { value: 50, color: AppConstants.colors.yellow },
        { value: 60, color: '#DBDF3F' },
        { value: 70, color: '#B7D343' },
        { value: 80, color: '#93C747' },
        { value: 90, color: '#6FBB4B' },
        { value: 100, color: AppConstants.colors.green },
    ];

    public static statsPages: any = {
        weekStats: {
            title: 'Semaines'
        }
    };

    public static closeDays: any = {
        yesterday: 'Hier',
        today: 'Aujourd\'hui',
        tomorrow: 'Demain'
    };

    public static weeksNames: any = {
        previous: 'Semaine dernière',
        current: 'Cette semaine',
        next: 'Semaine prochaine',
        default: 'Semaine du '
    };

    public static dateFormat: string = 'EEEE d MMMM';

    // Number of days displayed at the initialization of the objectives
    public static nbrDaysDisplayed: number = 7;

    public static nbrWeeksDisplayed: number = 7;

    public static indexTriggerCache: number = 2;

    public static limitDescription: number = 35;

    public static nbrDaysPeriodDefault: number = 7;

    public static ionFormat: string = 'DD/MM/YYYY';

    public static separator: string = '*£$';

    public static toastDefaultConfig: ToastOptions = {
        duration: 3000
    };

    // androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    public static datepickerDefaultConfig: DatePickerOptions = {
        date: null,
        mode: 'date',
        todayText: 'Aujourd\'hui',
        androidTheme: 2
    };

    public static scoresCoef: any = {
        done: {
            important: 10,
            medium: 6,
            trivial: 3
        },
        reported: -1
    };

    public static notificationsDefaultParameters: any = {
        hourOfDay: {
            hours: 18,
            min: 0,
            sec: 0,
            ms: 0
        },
        nbrLinesMax: 5
    };

    public static achievementsDefault: Achievement[] = [
        { description: 'Vous vous êtes fixé 5 objectifs !', type: AchievementType.NbrObjectifs, number: 5, priority: 1 },
        { description: 'Vous vous êtes fixé 10 objectifs !', type: AchievementType.NbrObjectifs, number: 10, priority: 2 },
        { description: 'Vous vous êtes fixé 50 objectifs !', type: AchievementType.NbrObjectifs, number: 50, priority: 3 },
        { description: 'Vous vous êtes fixé 100 objectifs !', type: AchievementType.NbrObjectifs, number: 100, priority: 4 },
        { description: 'Vous vous êtes fixé 200 objectifs !', type: AchievementType.NbrObjectifs, number: 200, priority: 5 },
        { description: 'Vous vous êtes fixé 500 objectifs !', type: AchievementType.NbrObjectifs, number: 500, priority: 6 },
        { description: 'Vous avez atteint 5 objectifs !', type: AchievementType.NbrObjectifsDone, number: 5, priority: 1 },
        { description: 'Vous avez atteint 10 objectifs !', type: AchievementType.NbrObjectifsDone, number: 10, priority: 2 },
        { description: 'Vous avez atteint 50 objectifs !', type: AchievementType.NbrObjectifsDone, number: 50, priority: 3 },
        { description: 'Vous avez atteint 100 objectifs !', type: AchievementType.NbrObjectifsDone, number: 100, priority: 4 },
        { description: 'Vous avez atteint 200 objectifs !', type: AchievementType.NbrObjectifsDone, number: 200, priority: 5 },
        { description: 'Vous avez atteint 500 objectifs !', type: AchievementType.NbrObjectifsDone, number: 500, priority: 6 }
    ];

    public static achivementsTitleDialog: string = 'Félicitations !';
}