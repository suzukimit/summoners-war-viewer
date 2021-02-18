import { Component } from '@angular/core';
import { extra, globalScoreRate, Rune, runeColumnFields, runeEffectType, runeSet } from 'src/app/rune/rune';
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
    columnFields = runeColumnFields(true);
    filterFields = [
        {
            label: 'セット',
            key: 'set_id',
            type: 'select',
            options: Object.entries(runeSet).map(e => ({ value: Number(e[0]), viewValue: e[1] })),
        },
        {
            label: 'スロット',
            key: 'slot_no',
            type: 'select',
            options: [1, 2, 3, 4, 5, 6].map(e => ({ value: e, viewValue: e })),
        },
        {
            label: '主オプション',
            key: 'mainType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: '接頭語オプション',
            key: 'prefixType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: 'サブオプション',
            key: 'sub1Type',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
            customFunction: (data: Rune, value): boolean => {
                return value.length === 0 || [data.sub1Type, data.sub2Type, data.sub3Type, data.sub4Type].some(e => value.includes(e));
            },
        },
        {
            label: '純正ランク',
            key: 'extra',
            type: 'select',
            options: Object.entries(extra).map(e => ({ value: Number(e[0]), viewValue: e[1] })),
        },
        {
            label: '装備可能のみ',
            key: 'canBeEquipped',
            type: 'toggle',
            customFunction: (data: Rune, value: any): boolean => data.unit == null,
        },
    ];

    ngOnInit(): void {
        this.subscriptions.push(
            this.subjectManager.runes.pipe(filter(runes => runes !== null)).subscribe(runes => {
                this.runes = runes;
            }),
        );
        globalScoreRate.init();
    }
}

