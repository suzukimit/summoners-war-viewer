import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Rune } from 'src/app/rune/rune';
import { Unit } from 'src/app/unit/unit';
import { SubjectManager } from 'src/app/common/subject.manager';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent {
    constructor(private http: HttpClient, private subjectManager: SubjectManager) {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.subscriptions.push(
            this.http.get('assets/スライ-724-4351283.json')
                .pipe(
                    map((res: any) => {
                        return res;
                    })
                )
                .subscribe(e => {
                    const units = e.unit_list.map(unit => Object.assign(new Unit(), unit));
                    const unitRunes = units.map(unit => unit.runes.map(rune => Object.assign(new Rune(), rune, { unit: unit })));
                    const runes = e.runes.map(rune => Object.assign(new Rune(), rune));
                    this.subjectManager.runes.next([].concat(...unitRunes).concat(runes));
                    this.subjectManager.units.next(units.filter(unit => unit.class >= 5 || unit.runes.length > 0));
                }),
        );
    }
}
