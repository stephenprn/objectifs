import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { AchievementType } from '@enumsPRN/achievement-type.enum';
import { Storage } from '@ionic/storage';
import { Achievement } from '@modelsPRN/achievement.model';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { UiService } from '@servicesPRN/ui.service';
import _ from 'lodash';

@Injectable()
export class AchievementsService {
    achievements: Achievement[];

    constructor(private objectifsService: ObjectifsService, private uiService: UiService,
        private storage: Storage) { }

    // TODO : Optimize this function
    checkAchievements(): void {
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
        let achievements: Achievement[] = [];

        Object.keys(achievementsJson).forEach((key: string) => {
            if (achievementsJson[key].length > 0) {
                const achievement: Achievement = achievementsJson[key].reduce((prev, current) => {
                    return (prev.priority > current.priority) ? prev : current;
                });

                achievements.push(achievement);
            }
        });

        if (!achievements || achievements.length === 0) {
            return;
        }

        const achievement: Achievement = achievements.reduce((prev, current) => {
            return (prev.priority > current.priority) ? prev : current;
        });

        console.log('Achievement reached');
        console.log(achievement);

        this.displayAlertDone(achievement);
    }

    private displayAlertDone(achievement: Achievement): void {
        this.uiService.displaySimpleAlert(AppConstants.achivementsTitleDialog, achievement.description);
    }

    loadStored(): Promise<Achievement[]> {
        return new Promise((resolve, reject) => {
            if (this.achievements != null) {
                resolve(this.achievements);
                return;
            }
    
            this.storage.get(AppConstants.storageNames.achievements).then((achievements: Achievement[]) => {
                if (!achievements) {
                    let achievementsDefault = _.cloneDeep(AppConstants.achievementsDefault);
        
                    achievementsDefault.map((achievement: Achievement) => {
                        achievement.done = false;
                    });
        
                    this.achievements = achievementsDefault;
                } else {
                    this.achievements = achievements;
                }
    
                resolve(this.achievements);
            });
        });
    }

    saveChanges(): void {
        this.storage.set(AppConstants.storageNames.achievements, this.achievements);
    }
}