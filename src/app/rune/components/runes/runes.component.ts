import { Component } from '@angular/core';
import { extra, Rune, runeEffectType, runeSet } from 'src/app/rune/rune';
import { SubjectManager } from 'src/app/common/subject.manager';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';

@Component({
    selector: 'app-runes',
    templateUrl: './runes.component.html',
    styleUrls: ['./runes.component.scss']
})
export class RunesComponent extends AbstractComponent {

    constructor(protected subjectManager: SubjectManager) {
        super();
    }

    columnFields = [
        {
            label: 'セット',
            key: 'setView',
        },
        {
            label: 'スロット',
            key: 'slot_no',
        },
        {
            label: 'メイン',
            key: 'mainView',
        },
        {
            label: '接頭',
            key: 'prefixView',
        },
        {
            label: 'サブ1（タイプ）',
            key: 'sub1TypeView',
        },
        {
            label: 'サブ1（数値）',
            key: 'sub1Value',
            sortable: true,
        },
        {
            label: 'サブ2（タイプ）',
            key: 'sub2TypeView',
        },
        {
            label: 'サブ2（数値）',
            key: 'sub2Value',
            sortable: true,
        },
        {
            label: 'サブ3（タイプ）',
            key: 'sub3TypeView',
        },
        {
            label: 'サブ3（数値）',
            key: 'sub3Value',
            sortable: true,
        },
        {
            label: 'サブ4（タイプ）',
            key: 'sub4TypeView',
        },
        {
            label: 'サブ4（数値）',
            key: 'sub4Value',
            sortable: true,
        },
        {
            label: '強化段階',
            key: 'upgrade_curr',
        },
        {
            label: '純正ランク',
            key: 'extraView',
        },
        {
            label: 'スコア',
            key: 'score',
            sortable: true,
        },
        {
            label: 'スコア+',
            key: 'potentialScore',
            sortable: true,
        },
        {
            label: 'ユニット',
            key: 'unitName',
        }
    ];
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

    ngOnInit(): void {}
}
