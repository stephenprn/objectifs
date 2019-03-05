import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Achievement } from '@modelsPRN/achievement.model';
import { AppConstants } from '@appPRN/app.constants';
import { ObjectifsService } from './objectifs.service';
import { UiService } from './ui.service';
import { AchievementType } from '@enumsPRN/achievementType.enum';

@Injectable()
export class AchievementsService {
    achievements: Achievement[];

    constructor(private objectifsService: ObjectifsService, private uiService: UiService) { }

    // TODO : Optimize this function
    checkAchievements(): void {
        if (this.achievements == null) {
            this.getAll();
        }

        let nbrObjectifsDone: number;
        let nbrObjectifs: number;
        let achievementDone: boolean = false;

        // We store all the objectives done classed by type
        let achievementsJson: any = {};
        achievementsJson[AchievementType.NbrObjectifsDone.toString().toString()] = [];
        achievementsJson[AchievementType.NbrObjectifs.toString()] = [];

        this.achievements.forEach((achievement: Achievement) => {
            if (!achievement.done) {
                switch (achievement.type) {
                    case AchievementType.NbrObjectifsDone.toString().toString(): {
                        if (nbrObjectifsDone == null) {
                            nbrObjectifsDone = this.objectifsService.filterObjectifs([{ criteria: 'done', value: true }], null, true);
                        }

                        if (achievement.number >= nbrObjectifsDone) {
                            achievement.done = true;
                            achievementDone = true;
                            achievementsJson[AchievementType.NbrObjectifsDone.toString().toString()].push(achievement);
                        }
                    }

                    case AchievementType.NbrObjectifs.toString(): {
                        if (nbrObjectifs == null) {
                            nbrObjectifs = this.objectifsService.filterObjectifs([], null, true);
                        }

                        if (achievement.number >= nbrObjectifs) {
                            achievement.done = true;
                            achievementDone = true;
                            achievementsJson[AchievementType.NbrObjectifs.toString()].push(achievement);
                        }
                    }
                }
            }
        });

        this.displayTheHighestPriority(achievementsJson);

        if (achievementDone) {
            this.saveChanges();
        }
    }

    private displayTheHighestPriority(achievementsJson: any) {
        Object.keys(achievementsJson).forEach((key: string) => {
            if (achievementsJson[key].length > 0) {
                const achievement: Achievement = achievementsJson[key].reduce((prev, current) => {
                    return (prev.priority > current.priority) ? prev : current;
                });
    
                this.displayAlertDone(achievement);
            }
        });
    }

    private displayAlertDone(achievement: Achievement): void {
        this.uiService.displaySimpleAlert(AppConstants.achivementsTitleDialog, achievement.description);
    }

    getAll(): Achievement[] {
        if (this.achievements != null) {
            return this.achievements;
        }

        let achievStorage: string = localStorage.getItem(AppConstants.storageNames.achievements);

        if (!achievStorage) {
            let achievements = _.cloneDeep(AppConstants.achievementsDefault);

            achievements.map((achievement: Achievement) => {
                achievement.done = false;
            });

            this.achievements = achievements;
        } else {
            this.achievements = JSON.parse(achievStorage);
        }

        return this.achievements;
    }

    saveChanges(): void {
        localStorage.setItem(AppConstants.storageNames.achievements, JSON.stringify(this.achievements));
    }
}