import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { APIService } from "app/core/api/api";
import { AuthService } from "app/core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { DataService } from "app/core/user/user.resolver";
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from "ngx-intl-tel-input";

@Component({
  selector: "app-add-user-modal",
  templateUrl: "./add-user-modal.component.html",
  styleUrls: ["./add-user-modal.component.scss"],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})
export class AddUserModalComponent implements OnInit {
  separateDialCode = true; 
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom];

  userForm: FormGroup;
  userInfo: any;
  editMode: boolean = false;
  userActionLoading: boolean = false;
  specialities: any[] = [];
  subscriptionTypes: any[] = [];
  license_list: any[] = [];
  dropdown: any = ["standard", "premium", "basic"];
  uploaded = false;
  photo: any;
  fileBase64: any;
  mimetype: any;
  filename: any;

  type: any;
  roles = [
    {
      masterdata_id: 4,
      data_name: "Care Coordinator",
    },
    {
      masterdata_id: 5,
      data_name: "Doctor",
    },
    {
      masterdata_id: 6,
      data_name: "Customer Support",
    },
  ];
  duration: any = [
    { masterdata_id: 3, data_name: "months" },
    { masterdata_id: 4, data_name: "years" },
  ];
  durations: any;
  editId: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: APIService,
    private auth: AuthService,
    // private dataService: DataService,

    private snackBar: MatSnackBar,
  ) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  ngOnInit(): void {
    console.log("tus", this.data);
    this.type = this.data.type;
    this.userForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      mobileNumber: new FormControl(null, [Validators.required]),
      city:new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      countryname: new FormControl("", Validators.required),
      roleId: new FormControl(this.data ? this.data.roleId : null, [Validators.required]),
    });
    this.getMasterDataInfo();
    this.getsubscriptionTypes();
    this.getDurations();
    if (this.data.editdata && this.data.editdata.user_id) {
      this.patchForm(this.data.editdata);
      this.editId = this.data.editdata.user_id;
    }
  }
  patchForm(data) {
    console.log(data)
    this.httpService
      .getAll(`api/adminstaff/get-adminstaff-by-id/${data.user_id}`)
      .subscribe((rsp) => {
        if (rsp.data.user.user_id) {
          this.userForm = this._formBuilder.group({
            name: rsp.data.user.fullname,
            email: rsp.data.user.email,
            mobileNumber: rsp.data.user.mobile,
            city: rsp.data.user.city,
            state: rsp.data.user.state,
            countryname: rsp.data.user.country,
            roleId: rsp.data.user.role_id, 
          });
          this.photo = rsp.data.user.profile_pic;
          const phoneNumberControl = this.userForm.controls.mobileNumber;
          phoneNumberControl.setValue({
            number: rsp.data.countrycode_details.number,
            internationalNumber: rsp.data.countrycode_details.internation_no,
            nationalNumber: rsp.data.countrycode_details.national_no,
            countryCode: rsp.data.countrycode_details.countrycode_name,
            dialCode: rsp.data.countrycode_details.dialcode,
            e164Number: rsp.data.countrycode_details.e164_number,
          });
        }
      });
  }
  capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return "";
    }
  }
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all spaces
    //let formattedNumber = phoneNumber.replace(/\s+/g, '');
    let formattedNumber = phoneNumber.replace(/[\s\(\)\-\+]/g, "");

    // Remove the leading zero, if it exists
    if (formattedNumber.startsWith("0")) {
      formattedNumber = formattedNumber.substring(1);
    }

    return formattedNumber;
  }

  addUser() {
    this.userActionLoading = true;

    const body = {
      userId: this.editId ? this.editId : 0,
      username: this.userForm.get("email").value,
      fullname: this.userForm.get("name").value,
      email: this.userForm.get("email").value,
      mobile: this.formatPhoneNumber(
        this.userForm.get("mobileNumber").value.nationalNumber,
      ),
      roleId: 2,
      actionBy: this.userInfo.user_id,
      isAdmin: true,
      // adminAccount: 1,
      city: this.userForm.get("city").value,
      state: this.userForm.get("state").value,
      country: this.userForm.get("countryname").value,
      countryCode: this.userForm.get("mobileNumber").value.dialCode,
      countryCodeDetails: {
        countryId: 0,

        countryName: this.userForm.get("mobileNumber").value.countryCode,
        dialCode: this.userForm.get("mobileNumber").value.dialCode,
        e164: this.userForm.get("mobileNumber").value.e164Number,
        international:
          this.userForm.get("mobileNumber").value.internationalNumber,
        national: this.userForm.get("mobileNumber").value.nationalNumber,
        number: this.userForm.get("mobileNumber").value.number,
      },

      photo: {
        filename: this.filename,
        mimetype: this.mimetype,
        base64: this.fileBase64,
      },
      createdBy: this.userInfo.user_id,
    }; 

    this.httpService.create("api/adminstaff/save-adminstaff", body).subscribe(
      (res: any) => {
        if (res?.isSuccess) {
          // this.dataService.setData(body["photo"]);

          this.dialogRef.close(true);
          // this.SaveActivity();
          this.snackBar.open("User added successfully. ", "close", {
            panelClass: "snackBarSuccess",
            duration: 2000,
          });
        } else {
          this.snackBar.open(res.data, "close", {
            panelClass: "snackBarWarning",
            duration: 2000,
          });
        }
        this.userActionLoading = false;
      },
      (error: any) => {
        this.userActionLoading = false;
        console.warn("error", error);
      },
    );
  }

  // addUser() {
  //   this.userActionLoading = true;
  //   let name = this.userForm.get("name").value;

  //   let firstName = name.split(' ').slice(0, -1).join(' ');
  //   let lastName = name.split(' ').slice(-1).join(' ');

  //   const body = {
  //     userid: 0,
  //     username: this.userForm.get("email").value,
  //     password: 'test@1234',
  //     firstname: firstName ? this.capitalizeFirstLetter(firstName) : lastName ? this.capitalizeFirstLetter(lastName) : undefined,
  //     lastname: firstName ? this.capitalizeFirstLetter(lastName) : undefined,
  //     emailaddress: this.userForm.get("email").value,
  //     mobileno: this.userForm.get("mobileNumber").value,
  //     roleid: parseInt(this.userForm.get("roleId").value),
  //     actionby: this.userInfo.user_id,
  //     adminaccount: 3,
  //     isadminaccount: false,
  //     undermainbranch: true,
  //     // specialityid: this.data.roleId == 5 ? 65 : 0
  //     specialityid: this.userForm.get("specialityid").value
  //   };
  //   this.httpService.create("api/User/AddUser", body).subscribe(
  //     (res: any) => {

  //       if(res?.isSuccess) {
  //         this.dialogRef.close(true);
  //         this.SaveActivity();
  //         this.snackBar.open('User added successfully. ', 'close', {
  //           panelClass: "snackBarSuccess",
  //           duration: 2000,
  //         });
  //       }else {
  //         this.snackBar.open(res.data, 'close', {
  //           panelClass: "snackBarWarning",
  //           duration: 2000,
  //         });
  //       }
  //       this.userActionLoading = false;
  //     },
  //     (error: any) => {
  //       this.userActionLoading = false;
  //       console.warn("error", error);
  //     }
  //   );
  // }

  SaveActivity() {
    const roleId = parseInt(this.userForm.get("roleId").value);
    const roleName = this.roles.find(
      (f) => f.masterdata_id === roleId,
    ).data_name;
    const body = {
      activityid: 0,
      userid: this.userInfo.user_id,
      titlename: "Added new member",
      descriptionname:
        "Added <b>" +
        this.userForm.get("name").value +
        "</b> as <b>" +
        roleName +
        "</b>",
      createdby: this.userInfo.user_id,
      categoryname: "AddUser",
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe(
      (res: any) => {},
      (error: any) => {
        console.log("error", error);
      },
    );
  }
  getMasterDataInfo() {
    const url = `api/User/GetMasterData?mastercategoryid=` + 21;
    this.httpService.getAll(url).subscribe(
      (res: any) => {
        this.specialities = res.data;

        // if (this.userInfo?.role_id === 5) {
        //   this.getDoctorDetails();
        // }
      },
      (error: any) => {
        console.log("error", error);
      },
    );
  }
  getsubscriptionTypes() {
    const url = `api/User/GetMasterData?mastercategoryid=` + 96;
    this.httpService.getAll(url).subscribe(
      (res: any) => {
        this.subscriptionTypes = res.data;
      },
      (error: any) => {
        console.log("error", error);
      },
    );
  }
  getDurations() {
    const url = `api/User/GetMasterData?mastercategoryid=26`;
    this.httpService.getAll(url).subscribe((res: any) => {
      this.durations = res.data.filter((item) => {
        return item.masterdata_id == 80354 || item.masterdata_id == 80355;
      });
    });
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      let file = event.target.files[0];

      reader.onload = function (event: any) {
        this.photo = event.target.result;
        this.disable_btn = false;
        const base64Content = this.photo;
        let base64ContentArray = base64Content.split(",");
        let mimeType = base64ContentArray[0].match(
          /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/,
        )[0];
        let base64Data = base64ContentArray[1];
        this.fileBase64 = base64Data;
        this.mimetype = mimeType;
        this.filename = file.name;
        this.uploaded = false;
        this.userForm.get("isPhotoUpdated").setValue(true);
        this.userForm.controls.isPhotoUpdated.markAsDirty();
        this.userForm.updateValueAndValidity({
          emitEvent: false,
          onlySelf: true,
        });
        this.cd.detectChanges();
      }.bind(this);

      reader.readAsDataURL(file);
    }
  }
  public delete() {
    this.photo = null;
  }

  onMouseEnter() {
    this.uploaded = false;
  }

  onInputChange(ev: string) {
    this.userForm.controls.email.setValue(ev.toLowerCase());
  }
}
