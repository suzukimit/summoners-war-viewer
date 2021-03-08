import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
    MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatDialogModule, MatDividerModule, MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import { RuneService } from 'src/app/rune/rune.service';
import { RunesComponent } from 'src/app/rune/components/runes/runes.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { UnitsComponent } from 'src/app/unit/components/units/units.component';
import { TableComponent } from './common/components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScoreRateFormComponent } from './rune/components/runes/score-rate-form/score-rate-form.component';
import { UnitComponent } from 'src/app/unit/components/unit/unit.component';
import { ArtifactsComponent } from 'src/app/artifacts/components/artifacts/artifacts.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        AbstractComponent,
        RunesComponent,
        UnitsComponent,
        TableComponent,
        ScoreRateFormComponent,
        UnitComponent,
        ArtifactsComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatToolbarModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatTabsModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule,
        MatDividerModule,
    ],
    providers: [
        SubjectManager,
        RuneService
    ],
    entryComponents: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
