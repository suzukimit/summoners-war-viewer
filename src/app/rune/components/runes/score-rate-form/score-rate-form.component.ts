import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {globalScoreRate, Rune} from 'src/app/rune/rune';
import {SubjectManager} from '../../../../common/services/sabject-manager/subject.manager';

@Component({
    selector: 'app-score-rate-form',
    templateUrl: './score-rate-form.component.html',
    styleUrls: ['./score-rate-form.component.scss']
})
export class ScoreRateFormComponent extends AbstractComponent {

    constructor(protected fb: FormBuilder, private subjectManager: SubjectManager) {
        super();
    }

    formGroup: FormGroup = null;
    @Output() onUpdate = new EventEmitter;

    runes: Rune[] = [];

    ngOnInit() {
        this.initForm();
        this.subscriptions.push(
            this.subjectManager.unitConfig.subscribe(this.onUnitConfigChange.bind(this)),
            this.subjectManager.runes.subscribe(runes => this.runes = runes),
        );
    }

    initForm() {
        this.formGroup = this.fb.group({
            hp: [globalScoreRate.hp, [Validators.required]],
            atk: [globalScoreRate.atk, [Validators.required]],
            def: [globalScoreRate.def, [Validators.required]],
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
        globalScoreRate.atk = this.formGroup.controls.atk.value;
        globalScoreRate.def = this.formGroup.controls.def.value;
        globalScoreRate.spd = this.formGroup.controls.spd.value;
        globalScoreRate.cliRate = this.formGroup.controls.cliRate.value;
        globalScoreRate.cliDmg = this.formGroup.controls.cliDmg.value;
        globalScoreRate.resist = this.formGroup.controls.resist.value;
        globalScoreRate.accuracy = this.formGroup.controls.accuracy.value;
        this.runes.forEach(rune => rune.init());
        this.onUpdate.emit();
    }

    onUnitConfigChange(config: any) {
        if (config) {
            this.formGroup.patchValue({
                hp: config.hp,
                atk: config.atk,
                def: config.def,
                spd: config.spd,
                cliRate: config.cliRate,
                cliDmg: config.cliDmg,
                resist: config.resist,
                accuracy: config.accuracy,
            });
            this.onUpdateScoreRate();
        }
    }
}
