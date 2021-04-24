import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { SubjectManager } from 'src/app/common/services/sabject-manager/subject.manager';
import { Unit, unitColumnFields, unitFilterFields } from 'src/app/unit/unit';
import { MatDialog } from '@angular/material';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent extends AbstractComponent {

    constructor(public subjectManager: SubjectManager, public dialog: MatDialog) {
        super();
    }

    columnFields = unitColumnFields();
    filterFields = unitFilterFields({});
    isImportCompleted = false;

    rowRouterLink = (unit: Unit) => `/units/${unit.id}`;

    ngOnInit(): void {
        this.subscriptions.push(
            this.subjectManager.importFileName.pipe(filter(e => e !== null)).subscribe(_ => {
                this.isImportCompleted = true;
            }),
        );
    }
}

