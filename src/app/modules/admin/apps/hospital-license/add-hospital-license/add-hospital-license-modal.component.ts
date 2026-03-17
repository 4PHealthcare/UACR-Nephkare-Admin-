import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { APIService } from "app/core/api/api";
import { AuthService } from "app/core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-hospital-license-modal',
  templateUrl: './add-hospital-license-modal.component.html',
  styleUrls: ['./add-hospital-license-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})
export class AddHospitalLicenseModalComponent implements OnInit {

  userForm: FormGroup;
  userInfo: any;
  editMode: boolean = false;
  userActionLoading:boolean = false;
  specialities:any[] = [];
  roles= [
    {
      "masterdata_id": 4,
      "data_name": "Care Coordinator"
    },
    {
      "masterdata_id": 5,
      "data_name": "Doctor"
    },
    {
      "masterdata_id": 6,
      "data_name": "Customer Support"
    },
    {
      "masterdata_id": 478,
      "data_name": "Hospital Admin"
    }
  ];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: APIService,
    private auth: AuthService,
    private snackBar: MatSnackBar) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }


  ngOnInit(): void {
    this.userForm = this._formBuilder.group({ 
      // firstName: ["", [Validators.required]],
      // lastName: ["", [Validators.required]],
      contactPersonName: ['', [Validators.required]],
      specialityid:['', [Validators.required]],
      hospitalName: ['', [Validators.required]],
      cityName: ['', [Validators.required]],
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
      roleId: [5, [Validators.required]],
    });
    this.getSpecialityList();
  }
  getSpecialityList() {
    const url = `api/User/GetMasterData?mastercategoryid=`+21;
     
    this.httpService.getAll(url).subscribe((res: any) => {
        this.specialities=res.data
      
    },
    (error: any) => {
        console.log('error', error);
    });
  }

  addUser() {
    this.userActionLoading = true;

    const body = {
      userid: 0,
      username: this.userForm.get("email").value,
      password: 'test@1234',
      hospitalname: this.userForm.get("hospitalName").value, 
      cityname: this.userForm.get("cityName").value,
      contactpersonname: this.userForm.get("contactPersonName").value,
      specialityid:this.userForm.get("specialityid").value,
      isphoto_updated : false,
      emailaddress: this.userForm.get("email").value,
      mobileno: this.userForm.get("mobileNumber").value,
      roleid: parseInt(this.userForm.get("roleId").value), 
      actionby: this.userInfo.user_id,
      isadminaccount: true,
      adminaccount: 0
    };
    this.httpService.create("api/User/AddClinic", body).subscribe( 
      (res: any) => {

        if(res?.isSuccess) {
          this.dialogRef.close(true);
          this.SaveActivity();
          this.snackBar.open('User added successfully. ', 'close', {
            panelClass: "snackBarSuccess",
            duration: 2000,
          });
        }else {
          this.snackBar.open(res.data, 'close', {
            panelClass: "snackBarWarning",
            duration: 2000,
          });
        }
        this.userActionLoading = false;
      },
      (error: any) => {
        this.userActionLoading = false;
        console.warn("error", error);
      }
    );
  }

  SaveActivity() {
    const roleId= parseInt(this.userForm.get("roleId").value);
    const roleName = this.roles.find(f=>f.masterdata_id === roleId).data_name;
    const body = {
      activityid: 0,
      userid: this.userInfo.user_id,
      titlename: "Added new Hospital License",
      descriptionname: "Added <b>"+this.userForm.get("hospitalName").value+"</b> as <b>"+roleName +"</b>",
      createdby: this.userInfo.user_id,
      categoryname: "AddHospitalLicense"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }
  onInputChange(ev: string) {
    this.userForm.controls.email.setValue(ev.toLowerCase()); 
  }
}
