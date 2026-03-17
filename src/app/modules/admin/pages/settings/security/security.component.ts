import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService } from 'app/core/api/api';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'settings-security',
  templateUrl: './security.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSecurityComponent implements OnInit {
  securityForm: FormGroup;
  userInfo: any;
  accountInfo: any;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private httpService: APIService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.securityForm = this._formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")]],
      twoStep: [false],
      askPasswordChange: [false],
    });
    this.getUserInfo(this.userInfo.user_id);
  }

  changePassword() {
    if (this.securityForm.get('currentPassword').value === this.securityForm.get('newPassword').value) {
      this.snackBar.open('Please enter the valid new password. ', 'close', {
        panelClass: "snackBarFailure",
        duration: 2000,
      });
    }
    else if (this.accountInfo?.password === this.securityForm.get('currentPassword').value) {
      const url = `api/User/ChangePassword`;
      const body = {
          userId: this.userInfo.user_id,
          oldPassword: this.securityForm.get('currentPassword').value,
          newPassword: this.securityForm.get('newPassword').value
      }
      this.httpService.create(url,body).subscribe((res: any) => {
        this.securityForm.reset();
        this.SaveActivity();
        this.getUserInfo(this.userInfo.user_id);
          this.snackBar.open('Password updated successfully. ', 'close', {
              panelClass: "snackBarSuccess",
              duration: 2000,
            });
      },
      (error: any) => {
          console.warn('error', error);
      })
    }
    else {
      this.snackBar.open('Please enter the valid current password. ', 'close', {
        panelClass: "snackBarFailure",
        duration: 2000,
      });
    }
  }

  SaveActivity() {
    const body = {
      activityid: 0,
      userid: this.userInfo.user_id,
      titlename: "Your Password have been changed",
      descriptionname: "Changed the password",
      createdby: this.userInfo.user_id,
      categoryname: "Password"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }

  clearForm(){
      this.securityForm.reset();
  }

  getUserInfo(userId: number) {
    this.httpService.get("api/User/GetUsersById?userId=", userId).subscribe(
      (res: any) => {
        this.accountInfo = res.data;
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }
  
}
