import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { Unit } from 'src/app/unit/unit';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent extends AbstractComponent {

    constructor(public subjectManager: SubjectManager, public dialog: MatDialog) {
        super();
    }

    columnFields = [
        {
            label: '名前',
            key: 'name',
        },
        {
            label: '属性',
            key: 'attributeName',
        },
        {
            label: 'unit_master_id',
            key: 'unit_master_id',
        },
        {
            label: 'unit_id',
            key: 'unit_id',
        },
        {
            label: 'クラス',
            key: 'class',
        },
        {
            label: 'レベル',
            key: 'unit_level',
        },
        {
            label: '発動ルーン',
            key: 'runeSet',
            valueAccessor: (unit: Unit) => unit.applicableRunes,
        },
        {
            label: 'ルーン1',
            key: 'rune1',
            valueAccessor: (unit: Unit) => unit.runes[0] ? unit.runes[0].unitScoreView : '',
        },
        {
            label: 'ルーン2',
            key: 'rune2',
            valueAccessor: (unit: Unit) => unit.runes[1] ? unit.runes[1].unitScoreView : '',
        },
        {
            label: 'ルーン3',
            key: 'rune3',
            valueAccessor: (unit: Unit) => unit.runes[2] ? unit.runes[2].unitScoreView : '',
        },
        {
            label: 'ルーン4',
            key: 'rune4',
            valueAccessor: (unit: Unit) => unit.runes[3] ? unit.runes[3].unitScoreView : '',
        },
        {
            label: 'ルーン5',
            key: 'rune5',
            valueAccessor: (unit: Unit) => unit.runes[4] ? unit.runes[4].unitScoreView : '',
        },
        {
            label: 'ルーン6',
            key: 'rune6',
            valueAccessor: (unit: Unit) => unit.runes[5] ? unit.runes[5].unitScoreView : '',
        },
        {
            label: 'スコア合計',
            key: 'runesScoreSum',
            sortable: true,
            valueAccessor: (unit: Unit) => unit.runesScoreSum,
        },
    ];

    rowRouterLink = (unit: Unit) => `/units/${unit.id}`;

    ngOnInit(): void {
    }
}

