export class AppConstants {
    private static colors: any = {
        red: '#F44336',
        orange: '#FF9800',
        black: '#000000',
        green: '#4CAF50',
        blue: '#2196F3',
        yellow: '#FFEB3B'
    };

    public static categories: any[] = [
        { id: 'health', title: 'santé', icon: 'medkit', color: AppConstants.colors.red },
        { id: 'relational', title: 'relationnel', icon: 'happy', color: AppConstants.colors.orange },
        { id: 'professional', title: 'professionnel', icon: 'briefcase', color: AppConstants.colors.black },
        { id: 'financial', title: 'financier', icon: 'cash', color: AppConstants.colors.green },
        { id: 'spiritual', title: 'spirituel', icon: 'eye', color: AppConstants.colors.blue },
        { id: 'other', title: 'autre', icon: 'bulb', color: AppConstants.colors.yellow }
    ];

    public static initialCategory: string = 'relational';

    public static importances: any[] = [
        { id: 'high', title: 'Haute', icon: 'arrow-up', color: AppConstants.colors.red, index: 2 },
        { id: 'medium', title: 'Moyenne', icon: 'arrow-forward', color: AppConstants.colors.orange, index: 1 },
        { id: 'low', title: 'Minime', icon: 'arrow-down', color: AppConstants.colors.green, index: 0 }
    ];

    public static initialImportance: string = 'medium';

    //Number of days displayed at the initialization of the objectives
    public static nbrDaysDisplayed: number = 7;

    public static indexTriggerCache: number = 2;

    public static limitDescription: number = 30;

    public static ionFormat: string = 'DD/MM/YYYY';

    public static scoresCoef: any = {
        done: {
            important: 10,
            medium: 6,
            trivial: 3
        },
        reported: -1
    }
}