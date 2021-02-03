import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { Unit } from 'src/app/unit/unit';
import { MatDialog } from '@angular/material';
import { UnitDialogComponent } from 'src/app/unit/components/unit-dialog/unit-dialog.component';

@Component({
    selector: 'app-units',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss']
})
export class UnitsComponent extends AbstractComponent {

    constructor(private subjectManager: SubjectManager, public dialog: MatDialog) {
        super();
    }

    columnFields = [
        {
            label: '名前',
            key: 'name',
        },
        {
            label: '属性',
            key: 'attributeName',
        },
        {
            label: 'unit_master_id',
            key: 'unit_master_id',
        },
        {
            label: 'unit_id',
            key: 'unit_id',
        },
        {
            label: 'クラス',
            key: 'class',
        },
        {
            label: 'レベル',
            key: 'unit_level',
        },
    ];

    clickRow(unit: Unit) {
        const dialogRef = this.dialog.open(UnitDialogComponent, {
            width: '1440px',
            data: unit
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    rowRouterLink = (unit: Unit) => `/units/${unit.id}`;

    ngOnInit(): void {
    }
}

