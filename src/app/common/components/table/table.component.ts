import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SubjectManager } from 'src/app/common/services/sabject-manager/subject.manager';
import {MatSortable} from '@angular/material/sort';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent<T=any> extends AbstractComponent implements OnInit {

    constructor(protected subjectManager: SubjectManager) {
        super();
    }

    @Input() data: T[] = [];
    @Input() dataSourceSubject: BehaviorSubject<T[]> = null;
    dataSource: MatTableDataSource<T> = null;
    filterValues = {};
    @Input() tableUpdateKey: string = '';
    @Input() columnFields: {
        label: string,
        key: string,
        toolTipKey: string,
        sortable:boolean,
        valueAccessor: any,
        showDefault: boolean
    } [] = [];
    @Input() defaultSortLabel: string = '';
    @Input() defaultSortOrder: 'asc' | 'desc' = 'asc';
    @Input() filterFields: {
        label: string,
        key: string,
        type: string,
        options: any[],
        customFunction: (data: T, value) => boolean,
        valueAccessor: (data: T) => any,
    }[] = [];
    @Input() pageable: boolean = false;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @Output() clickRowEvent = new EventEmitter<{row: T, i: number}>();
    @Input() rowRouterLink: (row: T) => string = null;
    @Input() rowSelectable: boolean = false;
    selected: number = -1;

    //外側から条件を指定する場合
    @Input() conditionValueSubject: BehaviorSubject<T[]> = null;

    //表示列の切り替え
    displayedColumns: string[] = [];
    columnsToDisplay: any[] = [];
    private get _displayedColumns() {
        return this.columnFields.filter(f => !this.canCustomizeColumnsToShow || f.showDefault).map(f => f.key);
    }
    @Input() canCustomizeColumnsToShow: boolean = true;

    ngOnInit(): void {
        this.displayedColumns = this._displayedColumns;
        this.columnsToDisplay = this.columnFields;
        this.initDataSource();
        if (this.dataSourceSubject) {
            this.subscriptions.push(
                this.dataSourceSubject.pipe(filter(data => data !== null)).subscribe((data: T[]) => {
                    this.dataSource.data = data;
                }),
            );
        }
        if (this.conditionValueSubject) {
            this.subscriptions.push(
                this.conditionValueSubject.pipe(filter(data => data !== null)).subscribe((data: any) => {
                    this.onConditionChange(data.condition, data.value);
                }),
            );
        }
    }

    initDataSource() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.paginator = this.paginator;
        if (this.defaultSortLabel) {
            this.sort.sort({id: this.defaultSortLabel, start: this.defaultSortOrder} as MatSortable);
        }
        this.dataSource.sort = this.sort;
    }

    createFilter() {
        const filterFunction = (data: T, filter: string): boolean => {
            const conditions = JSON.parse(filter);
            return Object.keys(conditions)
                .filter(key => conditions[key])
                .map(key => {
                    const field = this.filterFields.find(field => field.key === key);
                    const value = field.valueAccessor ? field.valueAccessor(data) : data[key];
                    if (field.customFunction) {
                        return field.customFunction(data, conditions[key]);
                    } else {
                        if (Array.isArray(conditions[key])) {
                            return conditions[key].length === 0 || conditions[key].includes(value);
                        } else if (field.type === 'text') {
                            return value.toLowerCase().includes(conditions[key].toLowerCase());
                        } else {
                            return value === conditions[key];
                        }
                    }
                })
                .every(e => e);
        };
        return filterFunction;
    }

    onConditionChange(condition, value) {
        this.filterValues[condition.key] = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    onColumnToShowChange(value: string[]) {
        this.columnsToDisplay.forEach(column => {
            column.showDefault = value.includes(column.key);
        });
        this.displayedColumns = this._displayedColumns;
    }
    get columnsToShowValue() {
        return this.columnsToDisplay.filter(c => c.showDefault).map(c => c.key);
    }

    resetFilters() {
        this.filterValues = {};
        this.dataSource.filter = '';
    }

    onClickRow(row: T, i: number) {
        this.clickRowEvent.emit({row: row, i: i});
        if (this.rowSelectable && this.selected !== i) {
            this.selected = i;
        } else {
            this.selected = -1;
        }
    }
}
