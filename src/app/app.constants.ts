export class AppConstants {
    public static categories: any[] = [
        { id: 'health', title: 'santé', icon: 'medkit', color: '#F44336' },
        { id: 'relational', title: 'relationnel', icon: 'happy', color: '#FF9800' },
        { id: 'professional', title: 'professionnel', icon: 'briefcase', color: '#000000' },
        { id: 'financial', title: 'financier', icon: 'cash', color: '#4CAF50' },
        { id: 'spiritual', title: 'spirituel', icon: 'eye', color: '#2196F3' },
        { id: 'other', title: 'autre', icon: 'bulb', color: '#FFEB3B' }
    ];

    public static initialCategory: string = 'relational';

    public static importances: any[] = [
        { id: 'high', title: 'Haute', icon: 'arrow-up', color: '#F44336', index: 2 },
        { id: 'medium', title: 'Moyenne', icon: 'arrow-forward', color: '#FF9800', index: 1 },
        { id: 'low', title: 'Minime', icon: 'arrow-down', color: '#4CAF50', index: 0 }
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