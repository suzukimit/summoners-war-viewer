import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectManager } from 'src/app/common/subject.manager';
import { ScoreRate } from 'src/app/rune/rune';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-score-rate-form',
    templateUrl: './score-rate-form.component.html',
    styleUrls: ['./score-rate-form.component.scss']
})
export class ScoreRateFormComponent extends AbstractComponent {

    constructor(protected subjectManager: SubjectManager, protected fb: FormBuilder) {
        super();
    }

    scoreRate: ScoreRate = new ScoreRate();
    formGroup: FormGroup = null;
    @Input() subject: BehaviorSubject<ScoreRate> = null;

    ngOnInit() {
        this.formGroup = this.fb.group({
            hp: [1, [Validators.required]],
            hpFlat: [0.01, [Validators.required]],
            atk: [1, [Validators.required]],
            atkFlat: [0.2, [Validators.required]],
            def: [1, [Validators.required]],
            defFlat: [0.2, [Validators.required]],
            spd: [2, [Validators.required]],
            cliRate: [1.5, [Validators.required]],
            cliDmg: [1.2, [Validators.required]],
            resist: [1, [Validators.required]],
            accuracy: [1, [Validators.required]],
        });
    }

    onUpdateScoreRate() {
        this.scoreRate.hp = this.formGroup.controls.hp.value;
        this.scoreRate.hpFlat = this.formGroup.controls.hpFlat.value;
        this.scoreRate.atk = this.formGroup.controls.atk.value;
        this.scoreRate.atkFlat = this.formGroup.controls.atkFlat.value;
        this.scoreRate.def = this.formGroup.controls.def.value;
        this.scoreRate.defFlat = this.formGroup.controls.defFlat.value;
        this.scoreRate.spd = this.formGroup.controls.spd.value;
        this.scoreRate.cliRate = this.formGroup.controls.cliRate.value;
        this.scoreRate.cliDmg = this.formGroup.controls.cliDmg.value;
        this.scoreRate.resist = this.formGroup.controls.resist.value;
        this.scoreRate.accuracy = this.formGroup.controls.accuracy.value;
        this.subject.next(this.scoreRate);
    }
}
