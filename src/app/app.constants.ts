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

    public static initialImportance: string = 'medium';

    //Number of days displayed at the initialization of the objectives
    public static nbrDaysDisplayed: number = 5;

    public static indexTriggerCache: number = 2;

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