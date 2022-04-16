import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import {environment} from '../environments/environment';
import {SubjectManager} from './common/services/sabject-manager/subject.manager';
import {ImportService} from './common/services/import/import.service';
import {unitBuildPresets} from './unit-build/preset';
import {globalScoreRate, Rune} from './rune/rune';
import {filter} from 'rxjs/operators';
import {UnitBuild} from './unit-build/unit-build';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent {
    constructor(private importService: ImportService, private subjectManager: SubjectManager) {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (!environment.production) {
            this.subscriptions.push(
                this.importService.importSample().subscribe(e => {
                    this.importService.next(e);
                    this.subjectManager.importFileName.next('demo.json');
                }),
                //TODO 将来的にはなにかのボタンを押したタイミングとかで計算するかも？（重めの処理なので）
                this.subjectManager.runes.pipe(filter(r => r != null)).subscribe(this.ranking.bind(this)),
            );
        }
    }

    ranking(runes: Rune[]) {
        unitBuildPresets.forEach(build => {
            build.updateGlobalScoreRate();
            const _runes = runes.filter(r => build.match(r));
            _runes.forEach(r => r.init());
            this.updateRank(_runes, build, 1);
            this.updateRank(_runes, build, 2);
            this.updateRank(_runes, build, 3);
            this.updateRank(_runes, build, 4);
            this.updateRank(_runes, build, 5);
            this.updateRank(_runes, build, 6);
        });
        globalScoreRate.init();
    }
    updateRank(runes: Rune[], build: UnitBuild, slot: number) {
        runes.filter(r => r.slot_no == slot)
            .sort((a, b) => b.potentialScore3 - a.potentialScore3)
            .slice(0, 20)
            .forEach((e, i) => e.runeScoreRankedAt.push( { unitBuild: build, order: i + 1} ));
    }
}
