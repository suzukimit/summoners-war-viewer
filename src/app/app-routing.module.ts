import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RunesComponent } from 'src/app/rune/components/runes/runes.component';
import { UnitsComponent } from 'src/app/unit/components/units/units.component';
import { UnitComponent } from 'src/app/unit/components/unit/unit.component';
import { ArtifactsComponent } from 'src/app/artifacts/components/artifacts/artifacts.component';
import { HomeComponent } from 'src/app/home/home.component';
import {RuneComponent} from './rune/components/rune/rune.component';


const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'runes', component: RunesComponent },
    { path: 'runes/:id', component: RuneComponent },
    { path: 'artifacts', component: ArtifactsComponent },
    { path: 'units', component: UnitsComponent },
    { path: 'units/:id', component: UnitComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
