import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Unit } from 'src/app/unit/unit';
import { Rune, runeColumnFields, ScoreRate, sortByScore } from 'src/app/rune/rune';
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
    runes: Rune[] = [];

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
    runeFields = runeColumnFields(true).concat([
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
    recommendedRuneFields = this.runeFields.filter(r => r.key !== 'slot_no');

    ngOnInit(): void {
        if (localStorage.getItem(this.unit.id)) {
            this.scoreRate = Object.assign(new ScoreRate(), JSON.parse(localStorage.getItem(this.unit.id)));
            this.subjectManager.unitScoreRateLoaded.next(this.scoreRate);
        }
        this.subscriptions.push(
            this.subjectManager.runes.pipe(filter(rune => rune !== null)).subscribe(runes => {
                this.runes = runes;
                this.streamRecommendedRunes();
            }),
            this.subjectManager.unitScoreRateSaved.pipe(filter(rate => rate !== null)).subscribe(rate => {
                this.scoreRate = rate;
                localStorage.setItem(this.unit.id, JSON.stringify(rate));
                this.streamRecommendedRunes();
            }),
        );
    }

    onRuneSetButtonChange(runeSetValues: string[]) {
        this.streamRecommendedRunes(runeSetValues);
    }

    streamRecommendedRunes(runeSetValues: string[] = []) {
        this.subjectManager.unitRecommendedRunes1.next(this.top10Runes({ slotNo: 1, runeSetValues: runeSetValues }));
        this.subjectManager.unitRecommendedRunes2.next(this.top10Runes({ slotNo: 2, runeSetValues: runeSetValues }));
        this.subjectManager.unitRecommendedRunes3.next(this.top10Runes({ slotNo: 3, runeSetValues: runeSetValues }));
        this.subjectManager.unitRecommendedRunes4.next(this.top10Runes({ slotNo: 4, runeSetValues: runeSetValues }));
        this.subjectManager.unitRecommendedRunes5.next(this.top10Runes({ slotNo: 5, runeSetValues: runeSetValues }));
        this.subjectManager.unitRecommendedRunes6.next(this.top10Runes({ slotNo: 6, runeSetValues: runeSetValues }));
    }

    top10Runes({ slotNo = 0, runeSetValues = [], canBeEquipped = true }): Rune[] {
        let runes = this.runes.filter(r => r.slot_no === slotNo);
        if (runeSetValues.length > 0) {
            runes = runes.filter(r => runeSetValues.includes(r.set_id.toString()));
        }
        if (canBeEquipped) {
            runes = runes.filter(r => r.unit == null);
        }
        return runes.sort(sortByScore(this.scoreRate)).slice(0, 9);
    }
}
