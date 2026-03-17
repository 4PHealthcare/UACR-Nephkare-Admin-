import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { APIService } from "app/core/api/api";
import { AuthService } from "app/core/auth/auth.service";

@Component({
  selector: "settings-account",
  templateUrl: "./account.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountComponent implements OnInit {
  accountForm: FormGroup;
  userInfo: any;
  accountInfo: any;

  constructor(
    private _formBuilder: FormBuilder,
    private httpService: APIService,
    private auth: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  ngOnInit(): void {
    // Create the form
    this.intitForm();
    this.getUserInfo(this.userInfo.user_id);
  }

  intitForm() {
    this.accountForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl({value: null, disabled: true},  [Validators.required, Validators.email], ),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("[6-9]\\d{9}"),
      ]),
    });
  }

  getUserInfo(userId: number) {
    this.httpService.get("api/User/GetUsersById?userId=", userId).subscribe(
      (res: any) => {
        this.accountInfo = res.data;
        this.patchForm(res.data);
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }

  patchForm(data: any) {
    this.accountForm.patchValue({
      name: data.first_name + " " + data.last_name,
      email: data.email_address,
      phone: data.mobile_no,
    });
  }

  updateAccount() {
    let name = this.accountForm.get("name").value.split(" ");
    this.accountForm.markAsPristine()
    const body = {
      userid: this.userInfo.user_id,
      username: this.accountForm.get("email").value,
      password: "test@1234",
      firstname: name.length > 2 ? name[0] + ' ' + name[1] : name[0],
      lastname: name.length > 2 ? name[2] : name[1],
      emailaddress: this.accountForm.get("email").value,
      mobileno: this.accountForm.get("phone").value,
      roleid: this.accountInfo.role_id,
      actionby: this.userInfo.user_id,
    };
    this.httpService.create("api/User/UpdateUser", body).subscribe(
      (res: any) => {
        console.warn(res);
        this.getUserInfo(this.userInfo.user_id);
        this.SaveActivity();
        this.snackBar.open('User updated successfully.', 'close', {
          panelClass: "snackBarSuccess",
          duration: 2000,
        });
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }

  SaveActivity() {
    const body = {
      activityid: 0,
      userid: this.userInfo.user_id,
      titlename: "Profile Update",
      descriptionname: "Profile have been updated",
      createdby: this.userInfo.user_id,
      categoryname: "Profile"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }

  cancelUpdate(){
    this.patchForm(this.accountInfo);
    this.accountForm.markAsPristine();
  }
}
