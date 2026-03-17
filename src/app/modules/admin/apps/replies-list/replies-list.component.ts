import { Component, Inject, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { APIService } from "app/core/api/api";
import { AuthService } from "app/core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FuseConfirmationConfig, FuseConfirmationService } from "@fuse/services/confirmation";
import { Router } from "@angular/router";

@Component({
  selector: 'app-replies-list',
  templateUrl: './replies-list.component.html',
  styleUrls: ['./replies-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})
export class RepliesListComponent implements OnInit {
  userInfo: any;
  communities: any[] = [];
  community:any;
  commentId:number;
  comment:string;
  articled_id:number;
  subCommentId:number;
  comments:any[] = [];
  selectedName:string;
  @ViewChild("messageInput", { static: false }) commentElement : ElementRef;
  host:string = 'https://hellokidneydata.s3.ap-south-1.amazonaws.com/';
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    
    @Inject(MAT_DIALOG_DATA) public communityData: FuseConfirmationConfig,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: APIService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    ) {
      
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  ngOnInit(): void { 
    console.log(this.data);
    console.log(this.data.repliesData.article_id);
    // this.community=this.communityData.article_id;
    // console.log(this.community);
    if(this.data && this.data.repliesData.article_id) {
      this.articled_id = this.data.repliesData.article_id;
      this.getComments();
    }
    
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
  blogDetails(id){
    this.dialogRef.close(true);
    this.router.navigate(['/pages/blogs/'+id]); 
  }
  Readmore = false;

 

  addComment() {

    let obj = 
    {
      "commentid": this.commentId ? this.commentId : 0,
      "articleid": this.articled_id,
      "userid": this.userInfo.user_id,
      "commentstext": this.comment,
      "subcommentid": this.subCommentId ? this.subCommentId : undefined
    }
    const url = `api/Community/CreateComment`;

    this.httpService.create(url, obj).subscribe(
      (res: any) => {
       
        this.comment = undefined;
        this.commentId = undefined;
        this.reset();
        this.getComments();
      },
      (error: any) => {
        this.snackBar.open(error, 'close', {
          panelClass: 'snackBarFailure',
          duration: 2000,
        });
      });

    
  }

  reset() {

    this.subCommentId = undefined;
    this.selectedName = undefined;

  }

  getComments() {
    console.log(this.data);
    this.comments = [];

    this.httpService.getAll(`api/Community/GetArticalsComments?articleid=${this.articled_id}`).subscribe(
      (res: any) => {
        
        if(res.data) {
          this.comments = res.data;
        }

      },
      (error: any) => {
        this.snackBar.open(error, 'close', {
          panelClass: 'snackBarFailure',
          duration: 2000,
        });
      });

  
  }
  deleteComment(comment:any) {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Comment',
      message: 'Are you sure you want to remove? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        const url = `api/Community/DeleteComment?commentid=${comment.comment_id}`;
        this.httpService.getAll(url).subscribe(
          (res: any) => {
            this.getComments();
            this.snackBar.open('Comment deleted successfully.', 'close', {
              panelClass: 'snackBarSuccess',
              duration: 2000,
            });
          },
          (error: any) => {
            this.snackBar.open(error, 'close', {
              panelClass: 'snackBarFailure',
              duration: 2000,
            });
          }
        );
      }
    });
  }
  edit(comment:any) {
    this.comment = comment.comments_text;
    this.commentId = comment.comment_id;
  }

  cancel() {
    this.comment = undefined;
    this.commentId = undefined;
    this.reset();
  }

  editsub(subcomment:any, comment:any) {
    this.comment = subcomment.comments_text;
    this.commentId = subcomment.comment_id;
    this.subCommentId = comment.comment_id;
  }
  reply(comment:any) {
    this.subCommentId = comment.comment_id;
    this.selectedName = comment.user_name;
    this.commentElement.nativeElement.focus();
  }

}
