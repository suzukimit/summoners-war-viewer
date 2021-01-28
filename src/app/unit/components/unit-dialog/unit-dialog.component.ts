import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Unit } from 'src/app/unit/unit';

@Component({
  selector: 'app-unit-dialog',
  templateUrl: './unit-dialog.component.html',
  styleUrls: ['./unit-dialog.component.scss']
})
export class UnitDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<UnitDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Unit) {}

    ngOnInit(): void {
    }

    columnFields = [
        {
            label: '体力',
            key: 'hpView',
        },
        {
            label: '攻撃力',
            key: 'atkView',
        },
        {
            label: '防御力',
            key: 'defView',
        },
        {
            label: '速度',
            key: 'spdView',
        },
        {
            label: 'クリ率',
            key: 'cliRateView',
        },
        {
            label: 'クリダメ',
            key: 'cliDamageView',
        },
        {
            label: '抵抗',
            key: 'resistView',
        },
        {
            label: '的中',
            key: 'accuracyView',
        },
    ];
}
