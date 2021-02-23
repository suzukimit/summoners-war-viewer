import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatSort } from '@angular/material';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SubjectManager } from 'src/app/common/subject.manager';

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
    @Input() columnFields: { label: string, key: string, toolTipKey: string, sortable:boolean, valueAccessor: any } [] = [];
    displayedColumns: string[] = [];
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
    @Output() clickRowEvent = new EventEmitter<T>();
    @Input() rowRouterLink: (row: T) => string = null;

    ngOnInit(): void {
        this.displayedColumns = this.columnFields.map(f => f.key);
        this.initDataSource();
        if (this.dataSourceSubject) {
            this.subscriptions.push(
                this.dataSourceSubject.pipe(filter(data => data !== null)).subscribe((data: T[]) => {
                    this.dataSource.data = data;
                }),
            );
        }
    }

    initDataSource() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    createFilter() {
        const filterFunction = (data: T, filter: string): boolean => {
            const conditions = JSON.parse(filter);
            return Object.keys(conditions)
                .filter(key => conditions[key])
                .map(key => {
                    const customFunction = this.filterFields.find(field => field.key === key).customFunction;
                    const valueAccessor = this.filterFields.find(field => field.key === key).valueAccessor;
                    const value = valueAccessor ? valueAccessor(data) : data[key];
                    if (customFunction) {
                        return customFunction(data, conditions[key]);
                    } else {
                        if (Array.isArray(conditions[key])) {
                            return conditions[key].length === 0 ? true : conditions[key].includes(value);
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

    resetFilters() {
        this.filterValues = {};
        this.dataSource.filter = '';
    }

    onClickRow(row: T) {
        this.clickRowEvent.emit(row);
    }
}
