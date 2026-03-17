import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';
import { APIService } from 'app/core/api/api';
import {
  FormGroup,
  NgForm,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  styles: [
    `
      .inventory-grid {
        grid-template-columns: 48px auto 40px;

        @screen sm {
          grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
          grid-template-columns: 48px 112px auto 112px 72px;
        }

        @screen lg {
          grid-template-columns: 20% 20% 25% 15% 17% 10%;
        }
      }
    `,
  ],
  providers:[{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  userInfo: any;
  patients$ = new BehaviorSubject<any>(null);
  pageSize = 10;
  currentPage = 0;
  filterVal = '';
  filterSubject = new Subject();
  totalRecords$ = new BehaviorSubject<any>(null);
  fromDate: Date;
  dateForm: FormGroup;
  sortDirection = '';
  sortBy = '';
  fileName = 'Patients.xlsx';
  uploadData: any = [];

  constructor(
    private auth: AuthService,
    private httpService: APIService,
    private fb: FormBuilder
  ) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  ngOnInit(): void {
    this.initForm();
    this.getPatientsInfo();
    this.filterSubject
      .pipe(
        debounceTime(500),
        map((val) => {
          this.getPatientsInfo();
        })
      )
      .subscribe();
  }

  initForm() {
    this.dateForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    this.dateForm.valueChanges.subscribe((data: any) => {
      this.getPatientsInfo();
    });
  }

  ngAfterViewInit(): void {}

  getPatientsInfo() {
    const url = `api/User/GetUsers`;
    const body = {
      roleid: 3,
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
      sortDirection: this.sortDirection,
    };
    this.httpService.create(url, body).subscribe((res: any) => {
      this.patients$.next(res.data.userdata);
      this.totalRecords$.next(res.data.totalrecords);
    });
  }

  onPageChange(index: any) {
    this.currentPage = index.pageIndex;
    this.pageSize = index.pageSize;
    this.getPatientsInfo();
  }

  filterData(val: any) {
    this.filterVal = val;
    this.filterSubject.next(val);
  }

  sortData(event: any) {
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.getPatientsInfo();
  }

  downloadData() {
    this.getAllRecords();
  }

  getAllRecords() {
    const url = `api/User/GetUsers`;
    const body = {
      roleid: 3,
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
            let personalInfo = "Patient Info";
            let phoneNumber = "Phone Number";
            let email = "Email";
            let rigisterDate = "Register Date";
            let status = "Status";
              const headers = [
                personalInfo,
                phoneNumber,
                rigisterDate,
                email,
                status
              ];
          this.uploadData.push(headers);
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

  addSpace(data: any) {
    const formatText = data.match(/.{1,5}/g);
    return formatText.join(' ');
  }
}
