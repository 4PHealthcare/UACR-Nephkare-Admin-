import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
  Brand,
  Category,
  Pagination,
  Doctor,
  Tag,
  Vendor,
} from './hospital-license.types';
import { ViewHospitalLicenseComponent } from './view-hospital-license/view-hospital-license.component';
import { APIService } from 'app/core/api/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { AddHospitalLicenseModalComponent } from './add-hospital-license/add-hospital-license-modal.component';
import * as XLSX from 'xlsx';
import moment from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};
@Component({
  selector: 'hospital-license',
  templateUrl: './hospital-license.component.html',
  styleUrls: ['./hospital-license.component.scss'],
  styles: [
    /* language=SCSS */
    // `
    //   .inventory-grid.clinic-grid {
    //     grid-template-columns: 48px auto 40px;

    //     @screen sm {
    //       grid-template-columns: 48px auto 112px 72px;
    //     }

    //     @screen md {
    //       grid-template-columns: 48px 112px auto 112px 72px;
    //     }
        
    //     @screen lg {
          
           
    //       grid-template-columns: 17% 12% 10% 22% 10% 10% 5%;
    //     }
    //   }
    // `,
  ],
  // grid-template-columns: 17% 12% 10% 25% 10% 10% 15%;
  // grid-template-columns:12% 10% 12% 25% 10% 10% 5%
  
  providers:[
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class HosplitalLicenseComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  doctorsList$ = new BehaviorSubject<any []>([]);
  adminInfo: any;
  pageSize = 10;
  currentPage = 0;
  filterVal = '';
  filterSubject = new Subject();
  totalRecords$ = new BehaviorSubject<any>(null);
  fromDate: Date;
  dateForm: FormGroup;
  sortDirection = '';
  sortBy = '';
  fileName = 'hospital-license.xlsx';
  uploadData: any = [];

  /**
   * Constructor
   */
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    public dialog: MatDialog,
    private httpService: APIService,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.adminInfo = JSON.parse(this.auth.adminUser);
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.initForm();
      this.getDoctorsList();
      this.filterSubject
      .pipe(
        debounceTime(500),
        map((val) => {
          this.getDoctorsList();
        })
      )
      .subscribe();
  }

  getDoctorsList() {
    const url = `api/User/GetMainbranchUsers?roleid`;
    const body = {
      roleid: 5,
      pageSize: this.pageSize,
      pageNo: this.currentPage + 1,
      searchtext: this.filterVal,
      fromdate: this.dateForm.get('fromDate').value
        ? moment(this.dateForm.get('fromDate').value).format('YYYY-MM-DD')
        : null,
      todate: this.dateForm.get('toDate').value
        ? moment(this.dateForm.get('toDate').value).format('YYYY-MM-DD')
        : null,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };
    this.httpService.create(url, body).subscribe(
      (res: any) => {
        if (res.data) {
        if (this.doctorsList$.value && this.doctorsList$.value.length == 0) {
          this.doctorsList$.next(res.data.userdata);            
        } else {
          this.doctorsList$.next([...this.doctorsList$.value, ...res.data.userdata]);
        }
          //  this.doctorsList$.next(res.data.userdata);
           this.totalRecords$.next(res.data.totalrecords);
       }
    });
  }
  onScroll() {
    this.currentPage = this.currentPage + 1;
    this.getDoctorsList()
  }

  initForm() {
    this.dateForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    this.dateForm.valueChanges.subscribe((data: any) => {
      this.getDoctorsList();
      this.doctorsList$.next([]);
    });
  }

  deleteSelectedDoctor(data: any): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Hospital License',
      message: 'Are you sure you want to remove? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete',
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === 'confirmed') {
        const url = `api/User/DeleteUser?userId=${data.user_id}&actionBy=${this.adminInfo.user_id}&isadminaccount=true`;
        this.httpService.create(url, {}).subscribe(
      (res: any) => {
        this.doctorsList$.next([]);
        this.getDoctorsList();
        this.SaveActivity(data?.first_name, data?.last_name, 0);
        this.snackBar.open('User deleted successfully.', 'close', {
          panelClass: 'snackBarSuccess',
          duration: 2000,
        });
      },
      (error: any) => {
        this.snackBar.open(error, 'close', {
          panelClass: 'snackBarFailure',
          duration: 2000,
        });
      });
      }
    });
  }

  viewDetails(doctor: Doctor, action: string) {
    const dialogRef = this.dialog.open(ViewHospitalLicenseComponent, {
      width: '40rem',
      height: '100%',
      position: { right: '0' },
      panelClass: 'view-details-form',
      data: { doctor, action },
    }).afterClosed().subscribe((data: any) => {
      if(data){
        this.getDoctorsList();
        this.doctorsList$.next([]);
      }
    });
  }

  changeStatus(data: any) {
    console.log(data);
    if (data.current_statusId === 27) {
      this.updateUserStatus(data.user_id, 28);
      this.SaveActivity(data?.first_name, data?.last_name, 28);
    } else if (data.current_statusId === 28) {
      this.updateUserStatus(data.user_id, 27);
      this.SaveActivity(data?.first_name, data?.last_name, 27);
    }
  }

  updateUserStatus(userId: any, statusId: any) {
    const url = `api/User/UpdateUserStatus?userId=${userId}&statusId=${statusId}`;
    this.httpService.create(url, {}).subscribe((res: any) => {
      this.snackBar.open('Status updated successfully.', 'close', {
        panelClass: "snackBarSuccess",
        duration: 2000,
      });
      this.getDoctorsList();
      this.doctorsList$.next([]);

    },
    (error: any) => {
        console.log('error', error);
    });
  }

  openAddUser() {
    this.dialog
      .open(AddHospitalLicenseModalComponent, {
        width: '25rem',
        height: '100%',
        position: { right: '0' },
        data: { roleId: 5 }
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.getDoctorsList();
          this.doctorsList$.next([]);

        }
      });
  }

  onPageChange(index: any) {
    this.currentPage = index.pageIndex;
    this.pageSize = index.pageSize;
    this.getDoctorsList();
    this.doctorsList$.next([]);
  }

  filterData(val: any) {
    this.filterVal = val;
    this.filterSubject.next(val);
    this.doctorsList$.next([]);

  }

  sortData(event: any) {
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.getDoctorsList();
    this.doctorsList$.next([]);

  }

  downloadData() {
    this.getAllRecords();
  }

  getAllRecords() {
    const url = `api/User/GetMainbranchUsers`;
    const body = {
      roleid: 5,
      allrecords: true,
      pageSize: 0,
      pageNo: 0,
      searchtext: '',
      fromdate: null,
      todate: null,
      sortBy: '',
      sortDirection: '',
    };
    this.httpService.create(url, body).subscribe((res: any) => {
      const usersData = res.data?.userdata;
      if (usersData.length > 0) {
        usersData.map((data: any) => {
          const fullName = data.first_name + ' ' + data.last_name;
          const date = new Date(data.created_on).getDate();
          const month = new Date(data.created_on).getMonth() + 1;
          const year = new Date(data.created_on).getFullYear();
          const regDate = date + '/' + month + '/' + year;
          const importData = [
            fullName,
            data.mobile_no,
            regDate,
            data.email_address,
            data.current_statusId,
          ];
          this.uploadData.push(importData);
        });
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.uploadData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, this.fileName);
        this.uploadData = [];
      }
    });
  }

  SaveActivity(firstName: string,lastName: string, statusId: any) {
    const name = firstName +" " + lastName;
    const body = {
      activityid: 0,
      userid: this.adminInfo.user_id,
      titlename: statusId === 0 ? "Member removed from the team" : statusId === 27 ? "Member Activated" : "Member Deactivated",
      descriptionname: statusId === 0 ? "Removed <b>"+ name +" - Researcher" : statusId === 27 ? "You have Activate <b>"+ name +" - Researcher </b>" : "Deactivated <b> "+ name +" - Researcher </b>",
      createdby: this.adminInfo.user_id,
      categoryname: statusId === 0 ? "DeleteUser" : "UserStatus"
    };
    const url = `api/PatientRegistration/CreateActivity`;
    this.httpService.create(url, body).subscribe((res: any) => { },
      (error: any) => { console.log('error', error); });
  }

}
