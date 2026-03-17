import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HealthWorkersRoutingModule } from './health-workers-routing.module';
import { HealthWorkersComponent } from './health-workers.component';
import { WorkersModalComponent } from './workers-modal/workers-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    HealthWorkersComponent,
    WorkersModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HealthWorkersRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
        MatDialogModule,
        InfiniteScrollModule,
        MatSortModule,
        MatTooltipModule
        

  ]
})
export class HealthWorkersModule { }
