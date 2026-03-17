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


@Component({ 
  selector: 'app-view-hospital-license',
  templateUrl: './view-hospital-license.component.html',
  styleUrls: ['./view-hospital-license.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .view-details-form .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})

export class ViewHospitalLicenseComponent implements OnInit {
  specialities:any[] = [];
  doctor: any = {
    avatar: null,
    role: 'Doctor',
    name: this.data.doctor.full_name ? this.data.doctor.full_name : this.data.doctor.first_name,
    contactPersonName: this.data.doctor.contactperson_name,
    specialityid:this.data.doctor.speciality_id,
    city: this.data.doctor.city,
    gender: '',
    age: null,
    country: 'in',
    status: 'active',
    mobileNumber: this.data.doctor.mobile_no,
    email: this.data.doctor.email_address,
    date: this.data.doctor.created_on,
    isadminaccount: this.data.doctor.isadmin_account, 
    adminaccount: this.data.doctor.admin_account
  };
  doctorForm: FormGroup;

  editMode: boolean = false;
  countries: Country[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  adminInfo: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private _contactsService: ContactsService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private httpService: APIService,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: any, action: string }
  ) {
    this.adminInfo = JSON.parse(this.auth.adminUser);
  }


  ngOnInit(): void {
    console.log(this.data.doctor);
    // Create the contact form
    this.doctorForm = this._formBuilder.group({
      id: [''],
      avatar: [null],
      contactPersonName: ['', [Validators.required]],
      specialityid:['', [Validators.required]],
      hospitalName: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      // role: ['', [Validators.required]],
      date: ['', [Validators.required]], 
    });

    // Patch values to the form
    this.doctor = {...this.doctor, 'hospitalName':this.doctor.name};
    this.doctorForm.patchValue(this.doctor);

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

   updateUser() {

    

    const body = {
      userid: this.data.doctor.user_id,
      username: this.doctorForm.get("email").value,
      password: 'test@1234',
      hospitalname: this.doctorForm.get("hospitalName").value, 
      cityname: this.doctorForm.get("city").value,
      contactpersonname: this.doctorForm.get("contactPersonName").value,
      specialityid:this.doctorForm.get("specialityid").value,
      isphoto_updated : false,
      emailaddress: this.doctorForm.get("email").value,
      mobileno: this.doctorForm.get("mobileNumber").value,
      roleid: this.data.doctor.role_id,
      actionby: this.adminInfo.user_id,
      isadminaccount: this.data.doctor.isadmin_account,
      adminaccount: this.data.doctor.admin_account
    };
    this.httpService.create('api/User/AddClinic', body).subscribe(
      (res: any) => {
        if(res.isSuccess) {
          this.dialogRef.close(true);
          this.SaveActivity();
          this.snackBar.open('Clinic updated successfully.', 'close', {
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
  }

  SaveActivity() {
    const desc = "Updated <b>"+this.doctorForm.get('hospitalName').value+" - Doctor </b> details";
    const body = {
      activityid: 0,
      userid: this.adminInfo.user_id,
      titlename: "Hospital License Updated",
      descriptionname: desc,
      createdby: this.adminInfo.user_id,
      categoryname: "EditHospitalLicense"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }

  // ChangetoLowerCase(ev){
   
  //   let val = ev.target.value;
  //   this.doctorForm.controls.email.patchValue(val.toLowerCase())
    
  // }
  onInputChange(ev: string) {
    this.doctorForm.controls.email.setValue(ev.toLowerCase()); 
  }
}
