import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import {environment} from '../environments/environment';
import {SubjectManager} from './common/services/sabject-manager/subject.manager';
import {ImportService} from './common/services/import/import.service';

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
            );
        }
    }
}
