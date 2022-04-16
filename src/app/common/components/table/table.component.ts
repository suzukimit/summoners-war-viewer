import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent<T=any> extends AbstractComponent implements OnInit {

    constructor() {
        super();
    }

    @Input() dataSourceSubject: BehaviorSubject<T[]> = null;
    dataSource: MatTableDataSource<T> = null;
    filterValues = {};
    @Input() columnFields: { label: string, key: string, sortable:boolean }[] = [];
    displayedColumns: string[] = [];
    @Input() filterFields: {
        label: string,
        key: string,
        type: string,
        options: any[],
        customFunction: (data: T, value) => boolean,
    }[] = [];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @Output() clickRowEvent = new EventEmitter<T>();

    ngOnInit(): void {
        this.displayedColumns = this.columnFields.map(f => f.key);
        this.subscriptions.push(
            this.dataSourceSubject.pipe(filter(data => data !== null)).subscribe((data: T[]) => {
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.filterPredicate = this.createFilter();
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }),
        );
    }

    createFilter() {
        const filterFunction = (data: T, filter: string): boolean => {
            const conditions = JSON.parse(filter);
            return Object.keys(conditions)
                .filter(key => conditions[key])
                .map(key => {
                    const customFunction = this.filterFields.find(field => field.key === key).customFunction;
                    return customFunction ? customFunction(data, conditions[key]) : data[key] === conditions[key];
                })
                .every(e => e);
        };
        return filterFunction;
    }

    onConditionChange(condition, value) {
        this.filterValues[condition.key] = value;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    resetFilters() {
        this.filterValues = {};
        this.dataSource.filter = '';
    }

    onClickRow(row: T) {
        this.clickRowEvent.emit(row);
    }
}
