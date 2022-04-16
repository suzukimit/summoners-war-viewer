import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
    MatButtonModule, MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule
} from '@angular/material';
import { RuneService } from 'src/app/rune/rune.service';
import { RunesComponent } from 'src/app/rune/components/runes/runes.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { UnitDialogComponent, UnitsComponent } from 'src/app/unit/components/units/units.component';
import { TableComponent } from './common/components/table/table.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        AbstractComponent,
        RunesComponent,
        UnitsComponent,
        UnitDialogComponent,
        TableComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatToolbarModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatDialogModule,
    ],
    providers: [
        SubjectManager,
        RuneService
    ],
    entryComponents: [
        UnitDialogComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
