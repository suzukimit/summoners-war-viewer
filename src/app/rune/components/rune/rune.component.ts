import {Component} from '@angular/core';
import {AbstractComponent} from '../../../common/components/base/abstract.component';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {SubjectManager} from '../../../common/services/sabject-manager/subject.manager';
import {Rune, runeColumnAllFields} from '../../rune';
import {combineLatest} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-rune',
  templateUrl: './rune.component.html',
  styleUrls: ['./rune.component.scss']
})
export class RuneComponent extends AbstractComponent {

    constructor(protected fb: FormBuilder, protected route: ActivatedRoute, public subjectManager: SubjectManager) {
        super();
    }

    rune: Rune = null;
    runes: Rune[] = [];
    runeFields = runeColumnAllFields.filter(f =>
        ['mainView', 'prefixView', 'sub1View', 'sub2View', 'sub3View', 'sub4View'].includes(f.key)
    );

    ngOnInit() {
        this.subscriptions.push(
            combineLatest(this.route.params, this.subjectManager.runes).pipe(
                filter(([params, runes]) => runes !== null)
            ).subscribe(([params, runes]) => {
                this.runes = runes;
                this.rune = runes.find(r => r.id === params.id);
            }),
        );
    }

}
