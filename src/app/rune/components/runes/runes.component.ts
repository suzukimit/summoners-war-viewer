import { Component } from '@angular/core';
import { extra, Rune, runeColumnFields, runeEffectType, runeSet, ScoreRate } from 'src/app/rune/rune';
import { SubjectManager } from 'src/app/common/subject.manager';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-runes',
    templateUrl: './runes.component.html',
    styleUrls: ['./runes.component.scss']
})
export class RunesComponent extends AbstractComponent {

    constructor(protected subjectManager: SubjectManager) {
        super();
    }
    runes: Rune[] = [];
    scoreRate: ScoreRate = new ScoreRate();
    columnFields = runeColumnFields.concat([
        {
            label: 'スコア',
            key: 'score',
            sortable: true,
            valueAccessor: (rune: Rune) => { return rune.calcScore(this.scoreRate) },
        },
        {
            label: 'スコア+',
            key: 'potentialScore',
            sortable: true,
            valueAccessor: (rune: Rune) => { return rune.calcPotentialScore(this.scoreRate) },
        },
        {
            label: 'ユニット',
            key: 'unitName',
            sortable: false,
            valueAccessor: null,
        }
    ]);
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
            label: 'メイン',
            key: 'mainType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: '接頭語',
            key: 'prefixType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: 'サブ1',
            key: 'sub1Type',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
            customFunction: (data: Rune, value): boolean => {
                return [data.sub1Type, data.sub2Type, data.sub3Type, data.sub4Type].includes(value);
            },
        },
        {
            label: 'サブ2',
            key: 'sub2Type',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
            customFunction: (data: Rune, value): boolean => {
                return [data.sub1Type, data.sub2Type, data.sub3Type, data.sub4Type].includes(value);
            },
        },
        {
            label: 'サブ3',
            key: 'sub3Type',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
            customFunction: (data: Rune, value): boolean => {
                return [data.sub1Type, data.sub2Type, data.sub3Type, data.sub4Type].includes(value);
            },
        },
        {
            label: 'サブ4',
            key: 'sub4Type',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
            customFunction: (data: Rune, value): boolean => {
                return [data.sub1Type, data.sub2Type, data.sub3Type, data.sub4Type].includes(value);
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
            this.subjectManager.runesScoreRate.pipe(filter(rate => rate !== null)).subscribe(rate => {
                this.scoreRate = rate;
            }),
        );
    }
}

