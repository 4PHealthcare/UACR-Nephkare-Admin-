import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { DocHospPatLsComponent } from './doc-hosp-pat-ls.component';
import { DocHospPatLsRoutes } from './doc-hosp-pat-ls.component.routing';
import { MatSelectModule } from '@angular/material/select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
    declarations: [
        DocHospPatLsComponent
    ],
    imports     : [
        RouterModule.forChild(DocHospPatLsRoutes),
        MatIconModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatTooltipModule,
        MatSortModule,
        SharedModule,
        MatSelectModule,
        InfiniteScrollModule
    ]
})
export class DocHospPatLsModule
{
}
