export class AppConstants {
    public static colors: any = {
        red: '#F44336',
        orange: '#FF9800',
        black: '#000000',
        green: '#4CAF50',
        blue: '#1976D2',
        yellow: '#FFEB3B',
        purple: '#6200EE'
    };

    public static categories: any[] = [
        { id: 'health', title: 'santé', icon: 'medkit', color: AppConstants.colors.red },
        { id: 'relational', title: 'relationnel', icon: 'happy', color: AppConstants.colors.orange },
        { id: 'professional', title: 'professionnel', icon: 'briefcase', color: AppConstants.colors.purple },
        { id: 'financial', title: 'financier', icon: 'cash', color: AppConstants.colors.green },
        { id: 'spiritual', title: 'spirituel', icon: 'eye', color: AppConstants.colors.blue },
        { id: 'other', title: 'autre', icon: 'bulb', color: AppConstants.colors.yellow }
    ];

    public static importances: any[] = [
        { id: 'high', title: 'Haute', icon: 'arrow-up', color: AppConstants.colors.red, index: 2 },
        { id: 'medium', title: 'Moyenne', icon: 'arrow-forward', color: AppConstants.colors.orange, index: 1 },
        { id: 'low', title: 'Minime', icon: 'arrow-down', color: AppConstants.colors.green, index: 0 }
    ];

    public static initialImportance: string = 'medium';

    public static periodicities: any[] = [
        { id: 'punctual', title: 'jamais' },
        { id: 'daily', title: 'tous les jours' },
        { id: 'weekly', title: 'toutes les semaines' },
        { id: 'monthly', title: 'tous les mois' },
        { id: 'custom', title: 'personnalisé' }
    ];

    public static initialPeriodicity: string = 'punctual';

    public static progressBarColors: any[] = [
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

    public static dateFormat: string = 'EEEE d MMMM';

    //Number of days displayed at the initialization of the objectives
    public static nbrDaysDisplayed: number = 7;

    public static indexTriggerCache: number = 2;

    public static limitDescription: number = 35;

    public static nbrDaysPeriodDefault: number = 7;

    public static ionFormat: string = 'DD/MM/YYYY';

    public static scoresCoef: any = {
        done: {
            important: 10,
            medium: 6,
            trivial: 3
        },
        reported: -1
    };
}