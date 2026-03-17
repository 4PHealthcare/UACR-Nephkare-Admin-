import {
  Component,
  Inject,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Country } from 'app/modules/admin/apps/contacts/contacts.types';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService } from 'app/core/api/api';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';


@Component({ 
  selector: 'app-view-doctor',
  templateUrl: './view-doctor.component.html',
  styleUrls: ['./view-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .view-details-form .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})

export class ViewDoctorComponent implements OnInit {

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];


  doctor: any = {
    photo: `https://hellokidneydata.s3.ap-south-1.amazonaws.com/${this.data.doctor.photo_folderpath}/${this.data.doctor.photo_filename}`,
    
    role: this.data.doctor.speciality,
    specialityid:this.data.doctor.speciality_id,
    name: this.data.doctor.first_name + ' ' +  this.data.doctor.last_name,
    gender: '',
    age: null,
    country: 'in',
    status: 'active',
    mobileNumber: this.data.doctor.mobile_no,
    email: this.data.doctor.email_address,
    date: this.data.doctor.created_on,
    hospitalname:this.data.doctor.clinic_name,
    city:this.data.doctor.city,
    state: this.data?.doctor?.countrycode_details?.state,
   // licenceId:this.data.doctor.license_type,
    durationValue:this.data.doctor.duration,
    durationId:this.data.doctor.duration_type

  };
  doctorForm: FormGroup;

  editMode: boolean = false;
  countries: Country[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  adminInfo: any;
  specialities:any [] = [];
  subscriptionTypes: any;
  durations: any;
  photo: any;
  fileBase64:any;
  mimetype:any;
  filename:any;
  uploaded = false;
  type: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private _contactsService: ContactsService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private httpService: APIService,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: any, action: string, type:any}
  ) {
    this.adminInfo = JSON.parse(this.auth.adminUser);
  }


  ngOnInit(): void {
    
    this.type = this.data.type;
    console.log(this.type);
    // Create the contact form
    this.doctorForm = this._formBuilder.group({
      id: [''],
      avatar: [null],
      specialityid:['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      hospitalname:['',[Validators.required]],
      city:['',Validators.required],
      state:['',Validators.required],
      //licenceId:['',Validators.required],
      durationValue:['',Validators.required],
      durationId:['',Validators.required],
      // role: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });

    let name:string;

    if (this.data.doctor.first_name && this.data.doctor.last_name) {
      name = this.data.doctor.first_name + ' ' +  this.data.doctor.last_name;
    } else if(this.data.doctor.first_name && !this.data.doctor.last_name) {
      name = this.data.doctor.first_name;
    } else if(!this.data.doctor.first_name && this.data.doctor.last_name) {
      name = this.data.doctor.last_name;
    }
    this.doctor.name = name;

    // Patch values to the form
    console.log(this.data)
    this.doctorForm.patchValue(this.doctor);
    const phoneNumberControl= this.doctorForm.controls.mobileNumber;
    phoneNumberControl.setValue({
      number: this.data.doctor.countrycode_details.number,
      internationalNumber: this.data.doctor.countrycode_details.internation_no,
      nationalNumber: this.data.doctor.countrycode_details.national_no,
      countryCode: this.data.doctor.countrycode_details.countrycode_name,
      dialCode: this.data.doctor.countrycode_details.dialcode,
      e164Number:this.data.doctor.countrycode_details.e164_number
    });
  
    console.log( this.doctorForm.controls.mobileNumber)


    // Get the countries
    this._contactsService.countries$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((countries: Country[]) => {
        // Update the countries
        this.countries = countries;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

      if(this.data && this.data.action && this.data.action=='edit') {
        this.editMode = true;
      }
      this.getMasterDataInfo();
      this.getsubscriptionTypes();
      this.getDurations();
  }

  /**
   * Get country info by iso code
   *
   * @param iso
   */
  getCountryByIso(iso: string): Country {
    return this.countries.find((country) => country.iso === iso);
  }

  /**
   * Toggle edit mode
   *
   * @param editMode
   */
  toggleEditMode(editMode: boolean | null = null): void {
    if (editMode === null) {
      this.editMode = !this.editMode;
    } else {
      this.editMode = editMode;
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
     * On destroy
     */
   ngOnDestroy(): void
   {
       // Unsubscribe from all subscriptions
       this._unsubscribeAll.next();
       this._unsubscribeAll.complete();
   }

   capitalizeFirstLetter(string) {
    if(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }else {
      return '';
    }
  
  }

   updateUser() {
    let name = this.doctorForm.get('name').value;
    console.log(this.doctorForm.get("mobileNumber").value)

    let firstName = name.split(' ').slice(0, -1).join(' ');
    let lastName = name.split(' ').slice(-1).join(' ');

    const body = {
      userid: this.data.doctor.user_id,
      username: this.doctorForm.get('email').value,
      password: 'test@1234',
      firstname: firstName ? this.capitalizeFirstLetter(firstName) : lastName ? this.capitalizeFirstLetter(lastName) : undefined,
      lastname: firstName ? this.capitalizeFirstLetter(lastName) : undefined,
      emailaddress: this.doctorForm.get('email').value,
      mobileno: this.formatPhoneNumber(this.doctorForm.get("mobileNumber").value.nationalNumber),
      roleid: this.data.doctor.role_id,
      actionby: this.adminInfo.user_id,
      specialityid: this.doctorForm.get('specialityid').value,
      adminaccount: this.data.doctor.admin_account,
      isadminaccount: this.data.doctor.isadmin_account,
      undermainbranch: this.data.doctor.under_mainbranch,
      hospitalName:this.doctorForm.get('hospitalname').value,
     // City:this.doctorForm.get('city').value,
     state:this.doctorForm.get('state').value,
      license_type:this.doctorForm.get('licenceId').value? this.doctorForm.get('licenceId').value:undefined,
      duration: this.doctorForm.get('durationValue').value ? parseInt(this.doctorForm.get('durationValue').value) : undefined,
      duration_type: this.doctorForm.get('durationId').value ? this.doctorForm.get('durationId').value : undefined,
      photo:{
        patientreportid: 0,
        filename:this.filename,
        mimetype:this.mimetype,
        fileBase64:this.fileBase64,
        issecondopinion: false
      },
      isphoto_updated: this.filename && this.mimetype? true: false,
      "countrycode_details": {
        "country_id": 0,
        "user_id": 0,
        "countrycode_name": this.doctorForm.get("mobileNumber").value.countryCode,
        "dialcode": this.doctorForm.get("mobileNumber").value.dialCode,
        "e164_number": this.doctorForm.get("mobileNumber").value.e164Number,
        "internation_no":this.doctorForm.get("mobileNumber").value.internationalNumber,
        "national_no": this.doctorForm.get("mobileNumber").value.nationalNumber,
        "number": this.doctorForm.get("mobileNumber").value.number
      },
      
            


    };
    this.httpService.create('api/User/UpdateUserbyadmin', body).subscribe(
      (res: any) => {
        if(res.isSuccess) {
          this.dialogRef.close(true);
          this.SaveActivity();
          this.snackBar.open('User updated successfully.', 'close', {
            panelClass: 'snackBarSuccess',
            duration: 2000,
          });
        }else {
          this.snackBar.open(res.data, 'close', {
            panelClass: 'snackBarWarning',
            duration: 2000,
          });
        }

      },
      (error: any) => {
        this.dialogRef.close();
        console.warn('error', error);
      }
    );
    // const body = {
    //   userid: this.data.doctor.user_id,
    //   username: this.doctorForm.get('email').value,
    //   password: 'test@1234',
    //  // hospitalname: this.userForm.get("name").value, 
    //   // cityname: this.userForm.get("cityName").value,
    //   contactpersonname: this.doctorForm.get('name').value,
    //   specialityid:this.doctorForm.get('specialityid').value,
    //   // isphoto_updated :this.userForm.get("isPhotoUpdated").value,
    //   // isphoto_updated:true,
    //   isphoto_updated: this.filename && this.mimetype? true: false,
    //    appname: this.type=='HWR'? 'HWR':'HLKD',
    //   emailaddress:  this.doctorForm.get('email').value,
    //   mobileno:this.formatPhoneNumber(this.doctorForm.get("mobileNumber").value.nationalNumber),
    //   roleid: parseInt(this.data.doctor.role_id),  
    //   actionby: this.adminInfo.user_id,
    //   isadminaccount: this.data.doctor.isadmin_account,
    //   adminaccount: this.data.doctor.admin_account,
    //   hospitalname:this.doctorForm.get('hospitalname').value,
    //   cityname:this.doctorForm.get('city').value,
    //   license_type:this.doctorForm.get('licenceId').value? this.doctorForm.get('licenceId').value:undefined,
    //   duration: this.doctorForm.get('durationValue').value ? parseInt(this.doctorForm.get('durationValue').value) : undefined,
    //   duration_type: this.doctorForm.get('durationId').value ? this.doctorForm.get('durationId').value : undefined,
    //   country_code: this.doctorForm.get("mobileNumber").value.dialCode,
    //   "countrycode_details": {
    //     "country_id": this.data.doctor.countrycode_details.country_id,
    //     "user_id": this.data.doctor.countrycode_details.user_id,
    //     "countrycode_name": this.doctorForm.get("mobileNumber").value.countryCode,
    //     "dialcode": this.doctorForm.get("mobileNumber").value.dialCode,
    //     "e164_number": this.doctorForm.get("mobileNumber").value.e164Number,
    //     "internation_no":this.doctorForm.get("mobileNumber").value.internationalNumber,
    //     "national_no": this.doctorForm.get("mobileNumber").value.nationalNumber,
    //     "number": this.doctorForm.get("mobileNumber").value.number
    //   },
  
    // photo:{
    //     patientreportid: 0,
    //     filename:this.filename,
    //     mimetype:this.mimetype,
    //     fileBase64:this.fileBase64,
    //     issecondopinion: false
    //   },
      
      
     

    // };
   
    // this.httpService.create("api/User/AddClinic", body).subscribe( 
    //   (res: any) => {

    //     if(res?.isSuccess) {
    //       // this.dataService.setData(body["photo"]);

    //       this.dialogRef.close(true);
    //       this.SaveActivity();
    //       this.snackBar.open('User added successfully. ', 'close', {
    //         panelClass: "snackBarSuccess",
    //         duration: 2000,
    //       });
    //     }else {
    //       this.snackBar.open(res.data, 'close', {
    //         panelClass: "snackBarWarning",
    //         duration: 2000,
    //       });
    //     }
    //    // this.userActionLoading = false;
    //   },
    //   (error: any) => {
    //    // this.userActionLoading = false;
    //     console.warn("error", error);
    //   }
    // );
  }
  formatPhoneNumber(phoneNumber: string): string {
    // Remove all spaces
    //let formattedNumber = phoneNumber.replace(/\s+/g, '');
    let formattedNumber = phoneNumber.replace(/[\s\(\)\-\+]/g, '');
    
    // Remove the leading zero, if it exists
    if (formattedNumber.startsWith('0')) {
      formattedNumber = formattedNumber.substring(1);
    }
    console.log(formattedNumber)
    return formattedNumber;
    
  }

  SaveActivity() {
    const desc = "Updated <b>"+this.doctorForm.get('name').value+" - Doctor </b> details";
    const body = {
      activityid: 0,
      userid: this.adminInfo.user_id,
      titlename: "Member updated",
      descriptionname: desc,
      createdby: this.adminInfo.user_id,
      categoryname: "EditUser"
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
  onInputChange(ev: string) {
    this.doctorForm.controls.email.setValue(ev.toLowerCase()); 
  }
  onSelectFile(event) {
    
    
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      
      let file = event.target.files[0];
     
      reader.onload = function (event: any) {
        this.doctor.photo = event.target.result;
        this.disable_btn=false;
        const base64Content = this.doctor.photo;
        let base64ContentArray = base64Content?.split(",");
        let mimeType = base64ContentArray[0].match(
          /[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/
        )[0];
        let base64Data = base64ContentArray[1];
        this.fileBase64=base64Data;
        this.mimetype=mimeType;
        this.filename=file.name;
        this.uploaded = false;
        this.accountForm.get('isPhotoUpdated').setValue(true);
        this.accountForm.controls.isPhotoUpdated.markAsDirty()
        this.accountForm.updateValueAndValidity({emitEvent: false, onlySelf: true});
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

}
