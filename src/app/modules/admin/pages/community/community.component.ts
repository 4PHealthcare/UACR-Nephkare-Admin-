import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import {
  distinctUntilChanged,
  map,
  takeUntil,
  switchMap,
  take,
} from "rxjs/operators";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Lightbox } from 'ngx-lightbox';

// import { Label, Blog } from '../blogs.types';
import { Router } from "@angular/router";
import { BlogsService } from "../blogs/blogs.service";
import { APIService } from "app/core/api/api";
import { RepliesListComponent } from "../../apps/replies-list/replies-list.component";
import { ArticleRepliesListComponent } from "../../apps/article-replies-list/article-replies-list.component";

@Component({
  selector: "community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityComponent {
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  filter$: BehaviorSubject<string> = new BehaviorSubject("Published");
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  masonryColumns: number = 1;
  blogsData: any[];
  blogs$ = new BehaviorSubject<any>(null);
  filterStatus: string = "Published";
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  selectedCategory: number;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _blogsService: BlogsService,
    private _router: Router,
    private httpService: APIService,
    private _lightbox: Lightbox,
    public dialog: MatDialog,
  ) {}
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.getCommunityList();
    // Request the data from the server
    this.getBlogsByStatus(this.filterStatus);

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode and drawerOpened if the given breakpoint is active
        if (matchingAliases.includes("lg")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
        }

        // Set the masonry columns
        //
        // This if block structured in a way so that only the
        // biggest matching alias will be used to set the column
        // count.
        if (matchingAliases.includes("xl")) {
          this.masonryColumns = 1;
        } else if (matchingAliases.includes("lg")) {
          this.masonryColumns = 1;
        } else if (matchingAliases.includes("md")) {
          this.masonryColumns = 1;
        } else if (matchingAliases.includes("sm")) {
          this.masonryColumns = 1;
        } else {
          this.masonryColumns = 1;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getBlogsByStatus(label: string): void {
    // this.loading = true;
    // filteredBlogs = filteredBlogs.filter(blog => blog.title.toLowerCase().includes(searchQuery) || blog.content.toLowerCase().includes(searchQuery));
    this.blogs$.next(null);
    this.blogsData = [];

    this._blogsService.getBlogs(label).subscribe(
      (res: any) => {
        if (res.data && res.isSuccess) {
          const blogs = res.data.map(function (blog: any) {
            if (blog.featureimg_filename && blog.featureimg_folderpath) {
              blog.img = `https://hellokidneydata.s3.ap-south-1.amazonaws.com/${blog.featureimg_folderpath}/${blog.featureimg_filename}`;
            }
            return blog;
          });

          this.blogsData = blogs;
          this.blogs$.next(blogs || []);
        } else {
          this.blogs$.next(res.data || []);
        }

        //   this.membersInfo$.next(res.data.filter(f=>f.role_id === 2));
      },
      (error: any) => {
        this.blogs$.next([]);
        console.warn("error", error);
      }
    );
  }

  /**
   * Open the edit labels dialog
   */
  openEditLabelsDialog(): void {}

  /**
   * Filter by archived
   */
  filterByArchived(): void {
    this.filter$.next("archived");
  }

  /**
   * Filter by label
   *
   * @param label
   */
  filterByLabel(label: string): void {
    this.filterStatus = label;

    this.getBlogsByStatus(label);
  }

  /**
   * Filter by query
   *
   * @param query
   */
  filterByQuery(query: string): void {
    this.blogs$.next(this.blogsData);

    if (query && query.length > 2) {
      const blogs = this.blogsData.filter((blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
      this.blogs$.next(blogs);
    }
  }

  /**
   * Reset filter
   */
  resetFilter(): void {
    this.filter$.next("blogs");
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  openBlogDialog(blog: any) {
    console.log(blog);

    this._router.navigateByUrl("/" + blog.id);
  }

  //  Post functionality

  communities: any[] = [];
  page_number = 1;
  page_limit = 10;
  isLoading: boolean = false;
  noDataFound: boolean = false;
  host:string = 'https://hellokidneydata.s3.ap-south-1.amazonaws.com/';
  getCommunityList(event?: any) {
    let obj = this;
      console.log(event)
    this.noDataFound = false;
    const url = `api/Community/GetArticalsListWithoutBlogs?pagesize=${this.page_limit}&pageno=${this.page_number}&userid=0`;
    this.httpService.create(url, {}).subscribe(
      (res: any) => {
        if (res.isSuccess && res.data && res.data.length !== 0) {
          if (this.page_number == 1) {
            this.communities = res.data;
          } else {
            this.communities = this.communities.concat(res.data);
            
          }
          this.page_number++;
        } else {
          this.noDataFound = true;
        }

        // if (event) event.target.complete();

        this.isLoading = false;
        this._changeDetectorRef.detectChanges();
      },
      (error: any) => {
        this.isLoading = false;
      }
    );
  }
  // onScrollDown(infiniteScroll) {
  //     console.log(infiniteScroll);
  //   setTimeout(() => {
  //     this.getCommunityList(infiniteScroll);
  //   }, 500);
  // }
  onScroll() {
    console.log('scrolled!!');
  }
  open(path:any, index: number): void {
      console.log(path);
      const src= 'https://hellokidneydata.s3.ap-south-1.amazonaws.com/'+path.articlesMedias[0].folder_path+'/'+path.articlesMedias[0].file_name;
      console.log(path);
    // open lightbox
    let list:any = [ {
        src:encodeURI(src)
    }]
    console.log(list);
    this._lightbox.open(list, 0);
  }
 
  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
  openReplyModal(communityData) {
    console.log(communityData)
    this.dialog
      .open(RepliesListComponent, {
        width: '35rem',
        height: '100%',
        position: { right: '0' },
        data: { repliesData: communityData },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          // this.getCustomerSupportUsers();
        }
      });
  }
  openArticleReplyModal(communityData) {
    console.log(communityData)
    this.dialog
      .open(ArticleRepliesListComponent, {
        width: '35rem',
        height: '100%',
        position: { right: '0' },
        data: { repliesData: communityData },
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          // this.getCustomerSupportUsers();
        }
      });
  }

  onScrollDown(ev: any) {
    console.log("scrolled down!", ev);

    this.getCommunityList(ev);

    // this.sum += 20;
    this.direction = "scroll down";
  }

  onScrollUp(ev: any) {
    console.log("scrolled up!", ev);
    // this.sum += 20;
    // this.prependItems();

    this.direction = "scroll up";
  }

  
}
