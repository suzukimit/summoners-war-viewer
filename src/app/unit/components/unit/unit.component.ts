import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { globalScoreRate, Rune, runeColumnFields, runeEffectType, runeSet, ScoreRate } from 'src/app/rune/rune';
import { filter } from 'rxjs/operators';
import { Unit } from 'src/app/unit/unit';
import { combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.scss']
})
export class UnitComponent extends AbstractComponent {

    constructor(protected route: ActivatedRoute, public subjectManager: SubjectManager) {
        super();
    }

    unit: Unit = null;
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
    runeFields = runeColumnFields(true);
    recommendedRuneFields = this.runeFields.filter(r => r.key !== 'slot_no');
    recommentedRuneFilterFields = [
        {
            label: 'セット',
            key: 'set_id',
            type: 'select',
            options: Object.entries(runeSet).map(e => ({ value: Number(e[0]), viewValue: e[1] })),
        },
        {
            label: 'メイン（2番）',
            key: 'mainType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: 'メイン（4番）',
            key: 'mainType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: 'メイン（6番）',
            key: 'mainType',
            type: 'select',
            options: Object.entries(runeEffectType).map(e => ({ value: Number(e[0]), viewValue: e[1].label })),
        },
        {
            label: '装備可能のみ',
            key: 'canBeEquipped',
            type: 'toggle',
            customFunction: (data: Rune, value: any): boolean => data.unit == null,
        },
    ];

    ngOnInit(): void {
        globalScoreRate.init();
        this.subscriptions.push(
            combineLatest(this.route.params, this.subjectManager.units, this.subjectManager.runes).pipe(
                filter(([params, units, runes]) => units !== null && runes !== null)
            ).subscribe(([params, units, runes]) => {
                this.unit = units.find(u => u.id === params.id);
                if (localStorage.getItem(this.unit.id)) {
                    globalScoreRate.copyFrom(Object.assign(new ScoreRate(), JSON.parse(localStorage.getItem(this.unit.id))));
                }
                this.runes = runes;
                this.streamRecommendedRunes();
            }),
        );
    }

    onUpdateScoreRate() {
        localStorage.setItem(this.unit.id, JSON.stringify(globalScoreRate));
        this.streamRecommendedRunes();
    }

    streamRecommendedRunes() {
        this.subjectManager.unitRecommendedRunes1.next(this.runes.filter(r => r.slot_no === 1).sort((a, b) => b.score - a.score));
        this.subjectManager.unitRecommendedRunes2.next(this.runes.filter(r => r.slot_no === 2).sort((a, b) => b.score - a.score));
        this.subjectManager.unitRecommendedRunes3.next(this.runes.filter(r => r.slot_no === 3).sort((a, b) => b.score - a.score));
        this.subjectManager.unitRecommendedRunes4.next(this.runes.filter(r => r.slot_no === 4).sort((a, b) => b.score - a.score));
        this.subjectManager.unitRecommendedRunes5.next(this.runes.filter(r => r.slot_no === 5).sort((a, b) => b.score - a.score));
        this.subjectManager.unitRecommendedRunes6.next(this.runes.filter(r => r.slot_no === 6).sort((a, b) => b.score - a.score));
    }

    onConditionChange(condition, value) {
        // this.filterValues[condition.key] = value;
        // this.dataSource.filter = JSON.stringify(this.filterValues);
        console.log(condition);
        console.log(value);
    }
}
