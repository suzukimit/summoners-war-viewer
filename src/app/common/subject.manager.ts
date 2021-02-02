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
    unitScoreRate: BehaviorSubject<ScoreRate>;

    constructor() {
        this.reset();
    }

    reset() {
        this.runes = new BehaviorSubject<Rune[]>(null);
        this.units = new BehaviorSubject<Unit[]>(null);
        this.runesScoreRate = new BehaviorSubject<ScoreRate>(null);
        this.unitScoreRate = new BehaviorSubject<ScoreRate>(null);
    }
}
