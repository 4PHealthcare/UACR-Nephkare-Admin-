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
// import { DataService } from "app/core/user/user.resolver";
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
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
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  userForm: FormGroup;
  userInfo: any;
  editMode: boolean = false;
  userActionLoading:boolean = false;
  specialities:any [] = [];
  subscriptionTypes:any[]=[];
  license_list:any[] =[];
  dropdown:any=['standard','premium','basic']
  uploaded = false;
  photo: any;
  fileBase64:any;
  mimetype:any;
  filename:any;


  type:any
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
    }
  ];
  duration:any=[{masterdata_id:3,data_name:'months'},{masterdata_id:4,data_name:'years'}]
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

    private snackBar: MatSnackBar) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  ngOnInit(): void {
    console.log('tus', this.data)
    this.type = this.data.type;
    this.userForm = this._formBuilder.group({ 
      // firstName: ["", [Validators.required]],
      // lastName: ["", [Validators.required]],
      specialityid: [65, this.type == 'HWR' ? '': Validators.required], 
      name: ['', [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      mobileNumber: [
        null,
        [
          Validators.required
        ],
      ],
      hospitalname:['',this.type == 'HWR' ? '': Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      countryname:['',Validators.required],
      // licenceId:['',Validators.required],
      // durationValue:['',Validators.required],
      // durationId:['',Validators.required],
      roleId: [this.data ? this.data.roleId: null, [Validators.required]],

    });
    this.getMasterDataInfo();
    this.getsubscriptionTypes();
    this.getDurations();
    if(this.data.editdata && this.data.editdata.user_id){
      this.patchForm(this.data.editdata);
      this.editId=this.data.editdata.user_id
    }
  }
  patchForm(data){
    this.userForm = this._formBuilder.group({ 
      specialityid: 65, 
      name:data.contactperson_name,
      email:data.email_address,
      mobileNumber: data.mobile_no,
      city:data.city,
      state:data.state,
      countryname:data.country,
      roleId: data.role_id,
    });
    this.photo=`https://hellokidneydata.s3.ap-south-1.amazonaws.com/${data.photo_folderpath}/${data.photo_filename}`;
    const phoneNumberControl= this.userForm.controls.mobileNumber;
    phoneNumberControl.setValue({
      number: data.countrycode_details.number,
      internationalNumber: data.countrycode_details.internation_no,
      nationalNumber: data.countrycode_details.national_no,
      countryCode: data.countrycode_details.countrycode_name,
      dialCode: data.countrycode_details.dialcode,
      e164Number:data.countrycode_details.e164_number
    });
  }
  capitalizeFirstLetter(string) {
    if(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }else {
      return '';
    }
  
  }
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all spaces
    //let formattedNumber = phoneNumber.replace(/\s+/g, '');
    let formattedNumber = phoneNumber.replace(/[\s\(\)\-\+]/g, '');
    
    // Remove the leading zero, if it exists
    if (formattedNumber.startsWith('0')) {
      formattedNumber = formattedNumber.substring(1);
    }
    
    return formattedNumber;
  }

  addUser() {
    this.userActionLoading = true;

    const body = {
      userid: this.editId?this.editId:0,
      username: this.userForm.get("email").value,
      password: 'test@1234',
     // hospitalname: this.userForm.get("name").value, 
      // cityname: this.userForm.get("cityName").value,
      contactpersonname: this.userForm.get("name").value, 
      specialityid:this.userForm.get("specialityid").value,
      // isphoto_updated :this.userForm.get("isPhotoUpdated").value,
      // isphoto_updated:true,
      isphoto_updated: this.filename && this.mimetype? true: false,
       appname: this.type=='HWR'? 'HWR':'HLKD',
      emailaddress: this.userForm.get("email").value,
      mobileno:this.formatPhoneNumber(this.userForm.get("mobileNumber").value.nationalNumber),
      roleid: parseInt(this.userForm.get("roleId").value),  
      actionby: this.userInfo.user_id,
      isadminaccount: true,
      adminaccount: 0,
      //hospitalname:this.userForm.get('hospitalname').value,
      cityname:this.userForm.get('city').value,
      statename:this.userForm.get('state').value,
      countryname:this.userForm.get('countryname').value, 
     // license_type:this.userForm.get('licenceId').value? this.userForm.get('licenceId').value:undefined,
      // duration: this.userForm.get('durationValue').value ? parseInt(this.userForm.get('durationValue').value) : undefined,
      // duration_type: this.userForm.get('durationId').value ? this.userForm.get('durationId').value:undefined,
      country_code: this.userForm.get("mobileNumber").value.dialCode,
      "countrycode_details": {
        "country_id": 0,
        "user_id": 0,
        "countrycode_name": this.userForm.get("mobileNumber").value.countryCode,
        "dialcode": this.userForm.get("mobileNumber").value.dialCode,
        "e164_number": this.userForm.get("mobileNumber").value.e164Number,
        "internation_no":this.userForm.get("mobileNumber").value.internationalNumber,
        "national_no": this.userForm.get("mobileNumber").value.nationalNumber,
        "number": this.userForm.get("mobileNumber").value.number
      },
  
    photo:{
        patientreportid: 0,
        filename:this.filename,
        mimetype:this.mimetype,
        fileBase64:this.fileBase64,
        issecondopinion: false
      },
      
      
     // is_otherhospital_doctor:

    };
    // if (this.mimetype && this.fileBase64) {
    //   body["photo"] = {
    //     patientreportid: 0,
    //     filename: this.filename,
    //     mimetype: this.mimetype,
    //     fileBase64: this.fileBase64,
    //   }
    // }
    this.httpService.create("api/User/AddClinic", body).subscribe( 
      (res: any) => {

        if(res?.isSuccess) {
          // this.dataService.setData(body["photo"]);

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
    const roleId= parseInt(this.userForm.get("roleId").value);
    const roleName = this.roles.find(f=>f.masterdata_id === roleId).data_name;
    const body = {
      activityid: 0,
      userid: this.userInfo.user_id,
      titlename: "Added new member",
      descriptionname: "Added <b>"+this.userForm.get("name").value+"</b> as <b>"+roleName +"</b>",
      createdby: this.userInfo.user_id,
      categoryname: "AddUser"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }
  getMasterDataInfo() {
   const url = `api/User/GetMasterData?mastercategoryid=`+21;
     this.httpService.getAll(url).subscribe((res: any) => {
        this.specialities=res.data;
      
        // if (this.userInfo?.role_id === 5) {
        //   this.getDoctorDetails();
        // }
    },
    (error: any) => {
        console.log('error', error);
    });
  }
  getsubscriptionTypes(){
    const url = `api/User/GetMasterData?mastercategoryid=`+96;
     this.httpService.getAll(url).subscribe((res: any) => {
        this.subscriptionTypes=res.data;
    },
    (error: any) => {
        console.log('error', error);
    });
  }
  getDurations() {
    const url = `api/User/GetMasterData?mastercategoryid=26`;
    this.httpService.getAll(url).subscribe((res: any) => {
     this.durations = res.data.filter(item => {
      return item.masterdata_id == 80354 ||  item.masterdata_id == 80355
     });
   });
  }
  onSelectFile(event) {
    
    
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      
      let file = event.target.files[0];
     
      reader.onload = function (event: any) {
        this.photo = event.target.result;
        this.disable_btn=false;
        const base64Content = this.photo;
        let base64ContentArray = base64Content.split(",");
        let mimeType = base64ContentArray[0].match(
          /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
        )[0];
        let base64Data = base64ContentArray[1];
        this.fileBase64=base64Data;
        this.mimetype=mimeType;
        this.filename=file.name;
        this.uploaded = false;
        this.userForm.get('isPhotoUpdated').setValue(true);
        this.userForm.controls.isPhotoUpdated.markAsDirty()
        this.userForm.updateValueAndValidity({emitEvent: false, onlySelf: true});
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
