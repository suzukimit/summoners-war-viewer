import { Component } from '@angular/core';
import { extra, globalScoreRate, Rune, runeColumnFields, runeFilterFields } from 'src/app/rune/rune';
import { SubjectManager } from 'src/app/common/services/sabject-manager/subject.manager';
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
    isImportCompleted = false;

    rowRouterLink = (rune: Rune) => `/runes/${rune.id}`;

    ngOnInit(): void {
        this.subscriptions.push(
            this.subjectManager.runes.pipe(filter(runes => runes !== null)).subscribe(runes => {
                this.runes = runes;
            }),
            this.subjectManager.importFileName.pipe(filter(e => e !== null)).subscribe(_ => {
                this.isImportCompleted = true;
            }),
        );
        globalScoreRate.init();
    }
}

