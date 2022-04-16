import { Component, Inject } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { Unit } from 'src/app/unit/unit';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

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
            label: 'クラス',
            key: 'class',
        },
        {
            label: 'レベル',
            key: 'unit_level',
        },
    ];
    filterFields = [
    ];

    clickRow(unit: Unit) {
        const dialogRef = this.dialog.open(UnitDialogComponent, {
            width: '250px',
            data: unit
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    ngOnInit(): void {
    }
}

@Component({
    selector: 'dialog-overview-example-dialog',
    template: `
        <h1 mat-dialog-title>Hi {{data.name}}</h1>
        <div mat-dialog-content>
            <p>What's your favorite animal?</p>
            <mat-form-field>
                <mat-label>Favorite Animal</mat-label>
                <input matInput [(ngModel)]="data.name">
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="onNoClick()">No Thanks</button>
            <button mat-button [mat-dialog-close]="data" cdkFocusInitial>Ok</button>
        </div>
    `
})
export class UnitDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<UnitDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Unit) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

}
