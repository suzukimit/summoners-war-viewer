import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {globalScoreRate, Rune} from 'src/app/rune/rune';
import {SubjectManager} from '../../../../common/services/sabject-manager/subject.manager';
import {UnitBuild} from '../../../../unit-build/unit-build';

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
            this.subjectManager.unitBuild.subscribe(this.onUnitBuildChange.bind(this)),
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
        this.runes.forEach(rune => rune.init());
        this.onUpdate.emit();
    }

    onUnitBuildChange(build: UnitBuild) {
        if (build) {
            this.formGroup.patchValue({
                hp: build.hp,
                atk: build.atk,
                def: build.def,
                spd: build.spd,
                cliRate: build.cliRate,
                cliDmg: build.cliDmg,
                resist: build.resist,
                accuracy: build.accuracy,
            });
            this.onUpdateScoreRate();
        }
    }
}
