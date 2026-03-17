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
  selector: 'app-view-customer-support',
  templateUrl: './view-customer-support.component.html',
  styleUrls: ['./view-customer-support.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .view-details-form .mat-dialog-container {
        padding: 0px;
      }
    `,
  ],
})
export class ViewCustomerSupportComponent implements OnInit {
  customer: any = {
    avatar: null,
    role: 'Customer Support',
    name:
      this.data.customerSupport.first_name +
      ' ' +
      this.data.customerSupport.last_name,
    gender: '',
    age: null,
    country: 'in',
    status: 'active',
    mobileNumber: this.data.customerSupport.mobile_no,
    email: this.data.customerSupport.email_address,
    date: this.data.customerSupport.created_on,
  };
  customerForm: FormGroup;

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
    @Inject(MAT_DIALOG_DATA)
    public data: { customerSupport: any; action: string }
  ) {
    this.adminInfo = JSON.parse(this.auth.adminUser);
    console.log(this.data.customerSupport);
  }

  ngOnInit(): void {
    // Create the contact form
    this.customerForm = this._formBuilder.group({
      id: [''],
      avatar: [null],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      // role: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });

    // Patch values to the form
    this.customerForm.patchValue(this.customer);

    // Get the countries
    this._contactsService.countries$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((countries: Country[]) => {
        // Update the countries
        this.countries = countries;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
    if (this.data && this.data.action && this.data.action == 'edit') {
      this.editMode = true;
    }
  }
  capitalizeFirstLetter(string) {
    if(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }else {
      return '';
    }
  
  }
  updateUser() {
    let name = this.customerForm.get('name').value;
    let firstName = name.split(' ').slice(0, -1).join(' ');
    let lastName = name.split(' ').slice(-1).join(' ');

    const body = {
      userid: this.data.customerSupport.user_id,
      username: this.customerForm.get('email').value,
      password: 'test@1234',
      firstname: firstName ? this.capitalizeFirstLetter(firstName) : lastName ? this.capitalizeFirstLetter(lastName) : undefined,
      lastname: firstName ? this.capitalizeFirstLetter(lastName) : undefined,
      emailaddress: this.customerForm.get('email').value,
      mobileno: this.customerForm.get('mobileNumber').value,
      roleid: this.data.customerSupport.role_id,
      actionby: this.adminInfo.user_id,
      adminaccount: this.data.customerSupport.admin_account,
      isadminaccount: this.data.customerSupport.isadmin_account,
      undermainbranch: this.data.customerSupport.under_mainbranch
    };
    this.httpService.create('api/User/UpdateUser', body).subscribe(
      (res: any) => { 
        
        if (res?.isSuccess) {
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
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  SaveActivity() {
    const desc = "Updated <b>"+this.customerForm.get('name').value+" - Customer Support </b> details";
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

}
