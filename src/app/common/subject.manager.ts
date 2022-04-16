import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rune } from 'src/app/rune/rune';
import { Unit } from 'src/app/unit/unit';

@Injectable({
    providedIn: 'root',
})
export class SubjectManager {
    runes: BehaviorSubject<Rune[]>;
    units: BehaviorSubject<Unit[]>;

    constructor() {
        this.reset();
    }

    reset() {
        this.runes = new BehaviorSubject<Rune[]>(null);
        this.units = new BehaviorSubject<Unit[]>(null);
    }
}
