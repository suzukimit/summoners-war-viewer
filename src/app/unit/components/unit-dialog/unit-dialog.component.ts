import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Unit } from 'src/app/unit/unit';
import { Rune, runeColumnFields, ScoreRate } from 'src/app/rune/rune';
import { SubjectManager } from 'src/app/common/subject.manager';
import { filter } from 'rxjs/operators';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';

@Component({
  selector: 'app-unit-dialog',
  templateUrl: './unit-dialog.component.html',
  styleUrls: ['./unit-dialog.component.scss']
})
export class UnitDialogComponent extends AbstractComponent {

    constructor(
        public dialogRef: MatDialogRef<UnitDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public unit: Unit,
        protected subjectManager: SubjectManager) {
        super();
    }

    scoreRate: ScoreRate = new ScoreRate();

    unitFields = [
        {
            label: '体力',
            key: 'hpView',
        },
        {
            label: '攻撃力',
            key: 'atkView',
        },
        {
            label: '防御力',
            key: 'defView',
        },
        {
            label: '速度',
            key: 'spdView',
        },
        {
            label: 'クリ率',
            key: 'cliRateView',
        },
        {
            label: 'クリダメ',
            key: 'cliDamageView',
        },
        {
            label: '抵抗',
            key: 'resistView',
        },
        {
            label: '的中',
            key: 'accuracyView',
        },
    ];
    runeFields = runeColumnFields.concat([
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
        }
    ]);

    ngOnInit(): void {
        this.subscriptions.push(
            this.subjectManager.unitScoreRate.pipe(filter(rate => rate !== null)).subscribe(rate => {
                this.scoreRate = rate;
            }),
        );
    }
}
