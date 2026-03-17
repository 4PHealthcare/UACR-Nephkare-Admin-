import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { takeUntil, debounceTime, map, switchMap } from "rxjs/operators";
import * as moment from "moment";
import { FormBuilder, FormGroup } from "@angular/forms";
import { APIService } from "app/core/api/api";
import { AuthService } from "app/core/auth/auth.service";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import * as XLSX from 'xlsx';
// import { BillingComponent } from "../../apps/queue/billing/billing.component";
// import { AddPatientComponent } from "../../apps/users/add-patient/add-patient.component";
// import { FuseConfirmationService } from "@fuse/services/confirmation";
// import { MatSnackBar } from "@angular/material/snack-bar";
// import { AppointmentFormModalComponent } from "../../apps/appointment-form-modal/appointment-form-modal.component";
// import { LabBillingComponent } from "../lab-billing/lab-billing.component";
// import { LabTestsComponent } from "../lab-tests/lab-tests.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FuseConfirmationService } from "@fuse/services/confirmation";
@Component({
  selector: 'app-doc-hosp-pat-ls',
  templateUrl: './doc-hosp-pat-ls.component.html',
  styles: [
    `
      .lab-list-grid { 
        grid-template-columns: 48px auto 40px;

        @screen sm {
          grid-template-columns: 48px auto 112px 72px;
        }

        @screen md {
          grid-template-columns: 160px auto 112px 72px;
        }

        @screen lg {
          grid-template-columns: 25% 15% 15% 15% 15% 10%;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocHospPatLsComponent implements OnInit {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  userInfo: any;
  pageSize = 10;
  currentPage = 0;
  filterVal = "";
  dateForm: FormGroup;
  sortDirection = "";
  sortBy = "";
  status_name:any
  filterSubject = new Subject();
  patients$ = new BehaviorSubject<any []>([]);
  totalRecords$ = new BehaviorSubject<any>(null);
  accountInfo = new BehaviorSubject<any>(null);
  name:any;
  id: any;
  uploadData: any = [];
  public hospitalName: any;
  status_list =[
    {id:0, name:'All'},
    {id:1, name:'Active'},
    {id:2, name:'In active'}
  ]
  status_type: boolean ;
  all_patients: any;
  fileName = 'Patients.xlsx';

  /**
   * Constructor
   */
  constructor(
    private httpService: APIService,
    private auth: AuthService,
    private _matDialog: MatDialog,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
   // this.userInfo = JSON.parse(this.auth.user);
  }

  ngOnInit(): void {
    this.status_name = 'All';
    this.status_type =true;
    this.all_patients='All'
    this._activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.id = params["id"];
    });
    this.newGetPatientsInfo();
    this.filterSubject
      .pipe(
        debounceTime(500),
        map((val) => {
          this.newGetPatientsInfo();
        })
      )
      .subscribe();
    this.getUserInfo(this.id);
  }
  initForm() {
    this.dateForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    this.dateForm.valueChanges.subscribe((data: any) => {
      this.newGetPatientsInfo();
    });

    this.dateForm.valueChanges.subscribe((data: any) => {
      this.newGetPatientsInfo();
    });

    
    
  }

 
  newGetPatientsInfo() {
   
    const url = `api/Patient/GetActiveInactiveListofPatients?pagesize=${this.pageSize}&pageno=${this.currentPage + 1}&searchkey=${this.filterVal}&adminid=${parseInt(this.id)}&ispatient_active=${this.status_type}&all_patients=${this.all_patients}`;
    this.httpService.getAll(url).subscribe(
      (res: any) => {
        if (res.data) {
          if (this.patients$.value && this.patients$.value.length === 0) {
            this.patients$.next(res.data.getActiveInactiveList);
          } else {
            this.patients$.next([...this.patients$.value, ...res.data.getActiveInactiveList ])
          }
          this.totalRecords$.next(res.data.total_records);
          console.log(this.patients$);
        }else{
          
        }
      },
      (error: any) => {
        //this.isLoading=false;
        console.log("error", error);
      }
    ); 
  }
  onScroll() {
    this.currentPage = this.currentPage + 1
    this.newGetPatientsInfo()
  }

  addSpace(data: any) {
    const formatText = data.match(/.{1,5}/g);
    return formatText.join(" ");
  }

  filterData(val: any) {
    this.filterVal = val;
    this.currentPage = 0;
    this.filterSubject.next(val);
    this.patients$.next([]);
  }
  onPageChange(index: any) {
    this.currentPage = index.pageIndex;
    this.pageSize = index.pageSize;
    this.newGetPatientsInfo();
    this.patients$.next([]);
  }
  
  sortData(event: any) {
    this.sortBy = event.active;
    this.sortDirection = event.direction;
    this.newGetPatientsInfo();
    this.patients$.next([]);
  }

  getUserInfo(userId: number) {
    this.httpService.get("api/User/GetUsersById?userId=", userId).subscribe(
      (res: any) => {
        if (res.data) {
          this.name=res.data.full_name;
          this.hospitalName=res.data.hospital_name;
          console.log(this.hospitalName)
          res.data.admin_name = res.data.isadmin_account
            ? res.data.contactperson_name
            : res.data.full_name
            ? res.data.full_name
            : res.data.first_name;
        }
        this.accountInfo.next(res.data);
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }
 
    deleteRecord(data) {
      console.log(data)
      const confirmation = this._fuseConfirmationService.open({
        title: "Delete Patient",
        message:
          "Are you sure you want to delete this? This action cannot be undone!",
        actions: {
          confirm: {
            label: "Delete",
          },
        },
      });
      confirmation.afterClosed().subscribe((result) => {
        if (result === "confirmed") {
          const url = `api/Patient/DeletePatient?patientid=`+data.user_id+`&withrelation=`+data.isprimary_account;
          this.httpService.create(url,null).subscribe(
            (res: any) => {
              if (res?.isSuccess) {
                this.patients$.next([]);
                this.newGetPatientsInfo();
                
                this.snackBar.open(
                  "Patient deleted successfully. ",
                  "close",
                  {
                    panelClass: "snackBarSuccess",
                    duration: 2000,
                  }
                );
              }
            },
            (error: any) => {
              console.log("error", error);
            }
          );
        }
      });
    }
    
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  goBack() {
    window.history.back();
  }
  filterByCategory(ev){
    console.log(ev.value)
    if(ev.value == "Active"){
      this.status_type  = true;
      this.all_patients = ''
    }else if(ev.value == "In active"){
      this.status_type  = false;
      this.all_patients = ''
    }else{
      // this.status_type  = 'All';
      this.status_type  = true;
      this.all_patients = 'All'
    }
    this.newGetPatientsInfo();
    this.patients$.next([]);
  }
  downloadData() {
    this.getAllRecords();
  }

  getAllRecords() {
    const url = `api/Patient/GetActiveInactiveListofPatients?pagesize=0&pageno=0&searchkey=&adminid=${parseInt(this.id)}&ispatient_active=true&all_patients=${this.all_patients}`;
    this.httpService.getAll(url).subscribe(
      (res: any) => {
       
        const usersData = res.data?.getActiveInactiveList;
        if (usersData.length > 0) {
          let patientId = "Patient Id";
              let personalInfo = "Personal Info";
              let phoneNumber = "Phone Number";
              // let riskCondition = "Risk/Condition";
              let rigisterDate = "Register Date";
                const headers = [
                  patientId,
                  personalInfo,
                  phoneNumber,
                  // riskCondition,
                  rigisterDate
                ];
                this.uploadData.push(headers);
              let i = 0;
          usersData.map((data: any) => {
            patientId = "HK00000" + (i + 1);
            personalInfo = data.first_name + ' ' + data.last_name+ ','+ data.age + 'yrs,'+data.gender;
                  phoneNumber = data.mobile_no;
                  // riskCondition = '--';
                  rigisterDate = data.created_on;
            const importData = [
              patientId,
              personalInfo,
              phoneNumber,
              // riskCondition,
              rigisterDate
            ];
            this.uploadData.push(importData);
          });
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.uploadData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, this.fileName);
          this.uploadData = [];
        }
      },
      (error: any) => {
        //this.isLoading=false;
        console.log("error", error);
      }
    ); 
    // const url = `api/User/GetHospitalbasedUsers`;
    // const body = {
    //   roleid: 3,
    //   allrecords: true,
    //   pageSize: 0,
    //   pageNo: 0,
    //   searchtext: '',
    //   fromdate: null,
    //   todate: null,
    //   sortBy: '',
    //   sortDirection: '',
    //   userid: parseInt(this.id)
    // };
    // this.httpService.create(url, body).subscribe((res: any) => {
    //   const usersData = res.data?.userdata;
    //   if (usersData.length > 0) {
    //     let patientId = "Patient Id";
    //         let personalInfo = "Personal Info";
    //         let phoneNumber = "Phone Number";
    //         // let riskCondition = "Risk/Condition";
    //         let rigisterDate = "Register Date";
    //           const headers = [
    //             patientId,
    //             personalInfo,
    //             phoneNumber,
    //             // riskCondition,
    //             rigisterDate
    //           ];
    //           this.uploadData.push(headers);
    //         let i = 0;
    //     usersData.map((data: any) => {
    //       patientId = "HK00000" + (i + 1);
    //       personalInfo = data.first_name + ' ' + data.last_name+ ','+ data.age + 'yrs,'+data.gender;
    //             phoneNumber = data.mobile_no;
    //             // riskCondition = '--';
    //             rigisterDate = data.created_on;
    //       const importData = [
    //         patientId,
    //         personalInfo,
    //         phoneNumber,
    //         // riskCondition,
    //         rigisterDate
    //       ];
    //       this.uploadData.push(importData);
    //     });
    //     const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.uploadData);
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, this.fileName);
    //     this.uploadData = [];
    //   }
    // });
  }

}
