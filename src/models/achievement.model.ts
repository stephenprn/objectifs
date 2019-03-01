import { AchievementType } from "@enumsPRN/achievementType.enum";

export class Achievement {
    description: string;
    date?: string;
    done?: boolean;
    type: AchievementType;
    number: number;
    priority: number; // Useful if two objectives of the same type are achieved at the same time to know the one to display
};