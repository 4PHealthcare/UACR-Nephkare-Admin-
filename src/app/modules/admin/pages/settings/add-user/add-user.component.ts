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
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})
export class AddUserComponent implements OnInit {
  roles: any = [];
  userForm: FormGroup;
  userInfo: any;
  editMode: boolean = false;
  roleId1 = [
    {
      "masterdata_id": 2,
      "data_name": "Admin"
    },
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
    }
  ];
  roleId2= [
    {
      "masterdata_id": 2,
      "data_name": "Admin"
    },
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
    }
  ];

  newRoles = [
    {
      "masterdata_id": 2,
      "data_name": "Admin"
    },
    {
      "masterdata_id": 480,
      "data_name": "Sub Admin"
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
    if (this.data && this.data.action && this.data.action === 'edit') {
      this.editMode = true;
    }
  }

  ngOnInit(): void {
    this.getRolesById();
    // Create the service form
    this.userForm = this._formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      mobileNumber: [
        null,
        [
          Validators.required,
          Validators.pattern('[6-9]\\d{9}')
        ],
      ],
      roleId: [null, [Validators.required]],
    });

    // Patch values to the form
    this.userForm.patchValue({
      firstName: this.data ? this.data.user.first_name : '',
      lastName: this.data ? this.data.user.last_name : '',
      email: this.data ? this.data.user.email_address: '',
      mobileNumber: this.data ? this.data.user.mobile_no: '',
      roleId: this.data ? this.data.user.role_id: this.userForm.get('roleId').value,
    });
  }

  addUser() {
    const body = {
      userid: 0,
      username: this.userForm.get("email").value,
      password: 'test@1234',
      firstname: this.userForm.get("firstName").value,
      lastname: this.userForm.get("lastName").value,
      emailaddress: this.userForm.get("email").value,
      mobileno: this.userForm.get("mobileNumber").value,
      roleid: parseInt(this.userForm.get("roleId").value),
      actionby: this.userInfo.user_id,
    };
    this.httpService.create("api/User/AddUser", body).subscribe(
      (res: any) => {
        if(res.isSuccess) {
        this.dialogRef.close(true);
        this.SaveActivity();
        this.snackBar.open('User added successfully. ', 'close', {
          panelClass: "snackBarSuccess",
          duration: 2000,
        });
      } else {
        this.snackBar.open(res.message, '.', {
          duration: 4000,
        });
      }
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }

  SaveActivity() {
    const name = this.userForm.get("firstName").value+ " "+ this.userForm.get("lastName").value;
    const roleId= parseInt(this.userForm.get("roleId").value);
    const roleName = this.roles.find(f=>f.masterdata_id === roleId).data_name;
    const desc = this.editMode ? "Updated <b>"+name+" - "+roleName +"</b> details" : "Added new member <b>"+name+" - "+roleName;
    const body = {
      activityid: 0,
      userid: this.userInfo.user_id,
      titlename: this.editMode ? "Member updated" : "Added new member",
      descriptionname: desc,
      createdby: this.userInfo.user_id,
      categoryname: this.editMode ? "EditUser" : "AddUser"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }

  updateUser() {
    const body = {
      userid: this.data.user.user_id,
      username: this.userForm.get("email").value,
      password: 'test@1234',
      firstname: this.userForm.get("firstName").value,
      lastname: this.userForm.get("lastName").value,
      emailaddress: this.userForm.get("email").value,
      mobileno: this.userForm.get("mobileNumber").value,
      roleid: parseInt(this.userForm.get("roleId").value),
      actionby: this.userInfo.user_id,
    };
    this.httpService.create("api/User/UpdateUser", body).subscribe(
      (res: any) => {
          if(res.isSuccess) {
          this.dialogRef.close(true);
          this.SaveActivity();
          this.snackBar.open('User updated successfully.', 'close', {
            panelClass: "snackBarSuccess",
            duration: 2000,
          });
        } else {
          this.snackBar.open(res.message, '.', {
            duration: 4000,
          });
        }
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }

  // getRoles() {
  //   this.httpService
  //     .getAll("api/User/GetMasterData?mastercategoryid=2")
  //     .subscribe((res: any) => {
  //       this.roles = res;
  //     });
  // }

  getRolesById() {
    if(this.userInfo.role_id === 1) {
      this.roles = this.roleId1;
    }
    else if (this.userInfo.role_id === 2) {
     this.roles = this.roleId2;
    }
    else {
      this.roles = [];
    }
  }
}
