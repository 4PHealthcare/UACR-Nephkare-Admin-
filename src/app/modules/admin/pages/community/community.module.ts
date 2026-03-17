import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommunityComponent } from "./community.component";
import { communityRoutes } from "./community.routing";

import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";

import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRippleModule } from "@angular/material/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { FuseMasonryModule } from "@fuse/components/masonry";
import { MatBadgeModule } from "@angular/material/badge";
import { SharedModule } from "app/shared/shared.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ReactiveFormsModule } from "@angular/forms";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LightboxModule } from 'ngx-lightbox';
import { ArticleRepliesListComponent } from '../../apps/article-replies-list/article-replies-list.component';
import { RepliesListComponent } from '../../apps/replies-list/replies-list.component';

@NgModule({
  declarations: [
    CommunityComponent,
    ArticleRepliesListComponent,
    RepliesListComponent
  ],
  imports: [
    RouterModule.forChild(communityRoutes),
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    NgSelectModule,
    FormsModule,
    FuseMasonryModule,
    MatBadgeModule,
    SharedModule,
    QuillModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    LightboxModule
  ],
})
export class CommunityModule {}
