import { ThrowStmt } from '@angular/compiler';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService } from 'app/core/api/api';

@Component({
  selector: 'app-workers-modal',
  templateUrl: './workers-modal.component.html',
  styleUrls: ['./workers-modal.component.scss'],
  styles: [
    `
      .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})
export class WorkersModalComponent implements OnInit {
  // workerspatch : any={
  //   first_name : this.data?.data?.first_name,
  //       last_name : this.data?.data?.last_name,
  //       email:this.data?.data?.email_address,
  //       mobileNumber : this.data?.data?.mobile_no,

  // }
  workersForm: FormGroup
  userdetails:any;
  userActionLoading:boolean = false;
  constructor(public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _apiservice : APIService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userdetails = JSON.parse(localStorage.getItem('adminUser'));
    // console.log(this.userdetails,'admin details')
    this.workersForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ["", [Validators.required, Validators.email]],
      mobileNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[6-9]\\d{9}')
        ],
      ],
      user_id:[null],
      roleId:[82564]
    })
    if(this.data?.data?.user_id){
      console.log(this.data?.data?.user_id)
      this.workersForm.patchValue({
        first_name : this.data?.data?.first_name,
        last_name : this.data?.data?.last_name,
        email:this.data?.data?.email_address,
        mobileNumber : this.data?.data?.mobile_no,
        user_id : this.data?.data?.user_id
      })
      this.isupdate=true;
      // this.workersForm.patchValue(this.workerspatch)
    }
  }
  isupdate:boolean=false;
  addHelathworkers() {
    this.userActionLoading=true;
    let payload = {
  "userid":this.workersForm.controls.user_id.value ? this.workersForm.controls.user_id.value : 0 ,
  "firstname": this.workersForm.controls.first_name.value, // string
  "lastname":this.workersForm.controls.last_name.value, // string
  "emailaddress": this.workersForm.controls.email.value, // string
  "mobileno": this.workersForm.controls.mobileNumber.value, // string
  "roleid":parseInt(this.workersForm.controls.roleId.value),
  "createdby": this.userdetails.admin_account,
  "adminid": this.userdetails.admin_account,
    }
    this._apiservice.create(`api/HealthWorker/CreateUpdateHealthWorker`,payload).subscribe((res)=>{
      if(res){
       this.userActionLoading=false;
        this.dialogRef.close(true);
        this.snackBar.open('Health Worker added successfully. ', 'close', {
          panelClass: "snackBarSuccess",
          duration: 2000,
        });
      } else if(res?.data==-1){
        this.snackBar.open('Health Worker already existed. ', 'close', {
          panelClass: "snackBarWarning",
          duration: 2000,
        });
        
      }
      
      (error: any) => {
        console.log('error', error);
    }
    })
    
    
  }

  onInputChange(ev: string) {
    this.workersForm.controls.email.setValue(ev.toLowerCase());
  }

  // gethealthworkersdetails(){

  //   this.workersForm.patchValue({
  //     firstname: 
  //   })
  // }
}
