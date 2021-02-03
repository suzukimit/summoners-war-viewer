import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RunesComponent } from 'src/app/rune/components/runes/runes.component';
import { UnitsComponent } from 'src/app/unit/components/units/units.component';
import { UnitComponent } from 'src/app/unit/components/unit/unit.component';
import { ArtifactsComponent } from 'src/app/artifacts/components/artifacts/artifacts.component';


const routes: Routes = [
    { path: 'runes', component: RunesComponent },
    { path: 'artifacts', component: ArtifactsComponent },
    { path: 'units', component: UnitsComponent },
    { path: 'units/:id', component: UnitComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
