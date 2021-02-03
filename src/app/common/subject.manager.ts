import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rune, ScoreRate } from 'src/app/rune/rune';
import { Unit } from 'src/app/unit/unit';

@Injectable({
    providedIn: 'root',
})
export class SubjectManager {
    runes: BehaviorSubject<Rune[]>;
    runesScoreRate: BehaviorSubject<ScoreRate>;
    units: BehaviorSubject<Unit[]>;
    unitScoreRateLoaded: BehaviorSubject<ScoreRate>;
    unitScoreRateSaved: BehaviorSubject<ScoreRate>;
    unitRecommendedRunes1: BehaviorSubject<Rune[]>;
    unitRecommendedRunes2: BehaviorSubject<Rune[]>;
    unitRecommendedRunes3: BehaviorSubject<Rune[]>;
    unitRecommendedRunes4: BehaviorSubject<Rune[]>;
    unitRecommendedRunes5: BehaviorSubject<Rune[]>;
    unitRecommendedRunes6: BehaviorSubject<Rune[]>;

    constructor() {
        this.reset();
    }

    reset() {
        this.runes = new BehaviorSubject<Rune[]>(null);
        this.units = new BehaviorSubject<Unit[]>(null);
        this.runesScoreRate = new BehaviorSubject<ScoreRate>(null);
        this.unitScoreRateLoaded = new BehaviorSubject<ScoreRate>(null);
        this.unitScoreRateSaved = new BehaviorSubject<ScoreRate>(null);
        this.unitRecommendedRunes1 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes2 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes3 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes4 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes5 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes6 = new BehaviorSubject<Rune[]>(null);
    }
}
