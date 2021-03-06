import { Component } from '@angular/core';
import { extra, globalScoreRate, Rune, runeColumnFields, runeFilterFields } from 'src/app/rune/rune';
import { SubjectManager } from 'src/app/common/subject.manager';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-runes',
    templateUrl: './runes.component.html',
    styleUrls: ['./runes.component.scss']
})
export class RunesComponent extends AbstractComponent {

    constructor(public subjectManager: SubjectManager) {
        super();
    }
    runes: Rune[] = [];
    columnFields = runeColumnFields();
    filterFields = runeFilterFields({});

    ngOnInit(): void {
        this.subscriptions.push(
            this.subjectManager.runes.pipe(filter(runes => runes !== null)).subscribe(runes => {
                this.runes = runes;
            }),
        );
        globalScoreRate.init();
    }
}

