import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { globalScoreRate } from 'src/app/rune/rune';

@Component({
    selector: 'app-score-rate-form',
    templateUrl: './score-rate-form.component.html',
    styleUrls: ['./score-rate-form.component.scss']
})
export class ScoreRateFormComponent extends AbstractComponent {

    constructor(protected fb: FormBuilder) {
        super();
    }

    formGroup: FormGroup = null;
    @Output() onUpdate = new EventEmitter;

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.formGroup = this.fb.group({
            hp: [globalScoreRate.hp, [Validators.required]],
            hpFlat: [globalScoreRate.hpFlat, [Validators.required]],
            atk: [globalScoreRate.atk, [Validators.required]],
            atkFlat: [globalScoreRate.atkFlat, [Validators.required]],
            def: [globalScoreRate.def, [Validators.required]],
            defFlat: [globalScoreRate.defFlat, [Validators.required]],
            spd: [globalScoreRate.spd, [Validators.required]],
            cliRate: [globalScoreRate.cliRate, [Validators.required]],
            cliDmg: [globalScoreRate.cliDmg, [Validators.required]],
            resist: [globalScoreRate.resist, [Validators.required]],
            accuracy: [globalScoreRate.accuracy, [Validators.required]],
            type: '',
        });
    }

    onUpdateScoreRate() {
        globalScoreRate.hp = this.formGroup.controls.hp.value;
        globalScoreRate.hpFlat = this.formGroup.controls.hpFlat.value;
        globalScoreRate.atk = this.formGroup.controls.atk.value;
        globalScoreRate.atkFlat = this.formGroup.controls.atkFlat.value;
        globalScoreRate.def = this.formGroup.controls.def.value;
        globalScoreRate.defFlat = this.formGroup.controls.defFlat.value;
        globalScoreRate.spd = this.formGroup.controls.spd.value;
        globalScoreRate.cliRate = this.formGroup.controls.cliRate.value;
        globalScoreRate.cliDmg = this.formGroup.controls.cliDmg.value;
        globalScoreRate.resist = this.formGroup.controls.resist.value;
        globalScoreRate.accuracy = this.formGroup.controls.accuracy.value;
        this.onUpdate.emit();
    }

    onScoreRateTypeChange(value) {
        const type = this.scoreRateTypeOptions.find(option => option.value == value);
        console.log(this.scoreRateTypeOptions);
        console.log(type);
        this.formGroup.patchValue({
            hp: type.hp,
            hpFlat: type.hpFlat,
            atk: type.atk,
            atkFlat: type.atkFlat,
            def: type.def,
            defFlat: type.defFlat,
            spd: type.spd,
            cliRate: type.cliRate,
            cliDmg: type.cliDmg,
            resist: type.resist,
            accuracy: type.accuracy,
        });
    }

    scoreRateTypeOptions = [
        {
            value: 'default',
            label: 'デフォルト',
            hp: 1,
            hpFlat: 0.01,
            atk: 1,
            atkFlat: 0.2,
            def: 1,
            defFlat: 0.2,
            spd: 2,
            cliRate: 1.5,
            cliDmg: 1.2,
            resist: 1,
            accuracy: 1,
        },
        {
            value: 'cri-raid',
            label: 'クリダメアタッカー（異界レイド）',
            hp: 0.5,
            hpFlat: 0.005,
            atk: 1,
            atkFlat: 0.2,
            def: 0.5,
            defFlat: 0.1,
            spd: 1,
            cliRate: 1.2,
            cliDmg: 1.5,
            resist: 0,
            accuracy: 0,
        },
    ];
}
