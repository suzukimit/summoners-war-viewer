import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rune, ScoreRate } from 'src/app/rune/rune';
import { Unit } from 'src/app/unit/unit';

@Injectable({
    providedIn: 'root',
})
export class SubjectManager {
    runes: BehaviorSubject<Rune[]>;
    units: BehaviorSubject<Unit[]>;
    unitScoreRateLoaded: BehaviorSubject<ScoreRate>;
    unitRecommendedRunes1: BehaviorSubject<Rune[]>;
    unitRecommendedRunes2: BehaviorSubject<Rune[]>;
    unitRecommendedRunes3: BehaviorSubject<Rune[]>;
    unitRecommendedRunes4: BehaviorSubject<Rune[]>;
    unitRecommendedRunes5: BehaviorSubject<Rune[]>;
    unitRecommendedRunes6: BehaviorSubject<Rune[]>;
    runeCondition: BehaviorSubject<any>;
    importFileName: BehaviorSubject<string>;
    unitConfig: BehaviorSubject<any>;

    constructor() {
        this.reset();
    }

    reset() {
        this.runes = new BehaviorSubject<Rune[]>(null);
        this.units = new BehaviorSubject<Unit[]>(null);
        this.unitScoreRateLoaded = new BehaviorSubject<ScoreRate>(null);
        this.unitRecommendedRunes1 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes2 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes3 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes4 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes5 = new BehaviorSubject<Rune[]>(null);
        this.unitRecommendedRunes6 = new BehaviorSubject<Rune[]>(null);
        this.runeCondition = new BehaviorSubject<any>(null);
        this.importFileName = new BehaviorSubject<string>(null);
        this.unitConfig = new BehaviorSubject<any>(null);
    }

    getRecommendedRunes(slotNo: number) {
        switch (slotNo) {
            case 1: return this.unitRecommendedRunes1;
            case 2: return this.unitRecommendedRunes2;
            case 3: return this.unitRecommendedRunes3;
            case 4: return this.unitRecommendedRunes4;
            case 5: return this.unitRecommendedRunes5;
            case 6: return this.unitRecommendedRunes6;
            default: return null;
        }
    }
}
