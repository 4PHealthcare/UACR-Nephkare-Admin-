import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthWorkersComponent } from './health-workers.component';

const routes: Routes = [
  {
    path      : '',
    pathMatch : 'full', 
    component: HealthWorkersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthWorkersRoutingModule { }
