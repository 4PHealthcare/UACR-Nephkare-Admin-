import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApexOptions } from 'ng-apexcharts';
import { ProjectService } from 'app/modules/admin/dashboards/project/project.service';
import { APIService } from 'app/core/api/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
declare var hbspt: any;

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit, OnDestroy {
  patientsInfoOptions: ApexOptions = {};
  chartTaskDistribution: ApexOptions = {};
  chartBudgetDistribution: ApexOptions = {};
  chartWeeklyExpenses: ApexOptions = {};
  chartMonthlyExpenses: ApexOptions = {};
  chartYearlyExpenses: ApexOptions = {};
  doctorsOptions: ApexOptions;
  careTeamOptions: ApexOptions;
  data: any;
  selectedProject: string = 'ACME Corp. Backend App';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  dashBoardInfo$ = new BehaviorSubject<any>(null);
  overviewData: any;
  selectedPatientInfoType = 'week';
  weeklyPatientInfo: any;
  monthlyPatientInfo: any;
  yearlyPatientInfo: any;
  patientsCount$ = new BehaviorSubject<any>(null);
  selectedDoctorInfoType = 'week';
  doctorsInfo: any;
  monthlyDoctorsInfo: any;
  yearlyDoctorsInfo: any;
  selectedCareTeamType = 'week';
  doctorsCount$ = new BehaviorSubject<any>(null);
  careTeamCount$ = new BehaviorSubject<any>(null);
  userInfo: any;
  accountInfo = new BehaviorSubject<any>(null);
  projectNames :any []=[]
  project_name:any;

  constructor(
    private _projectService: ProjectService,
    private _router: Router,
    private httpService: APIService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.userInfo = JSON.parse(this.auth.adminUser);
  }

  ngOnInit(): void {
    
   
    this.getUserInfo(this.userInfo.user_id);
    this.getProjectNames()
    this.project_name ='Hello Kidney';
    //this.getDashboadInfo('HLKD');
    // Get the data
    this._projectService.data$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        // Store the data
        this.data = data;
      });

    // Attach SVG fill fixer to all ApexCharts
    window['Apex'] = {
      chart: {
        events: {
          mounted: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
          updated: (chart: any, options?: any): void => {
            this._fixSvgFill(chart.el);
          },
        },
      },
    };
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private _fixSvgFill(element: Element): void {
    // Current URL
    const currentURL = this._router.url;

    // 1. Find all elements with 'fill' attribute within the element
    // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
    // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
    Array.from(element.querySelectorAll('*[fill]'))
      .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
      .forEach((el) => {
        const attrVal = el.getAttribute('fill');
        el.setAttribute(
          'fill',
          `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
        );
      });
  }

  // getDashboadInfo(appName) {
  //   const url = `api/User/GetDashboardStatistics?appname=${appName}`;
  //   this.httpService.getAll(url).subscribe((res: any) => {
  //     this.dashBoardInfo$.next(res.data);
  //     this.weeklyPatientInfo = res.data.patient_info_weekly_registration_graph;
  //     this.monthlyPatientInfo =
  //       res.data.patient_info_monthly_registration_graph;
  //     this.yearlyPatientInfo = res.data.patient_info_yearly_registration_graph;
  //     this.overviewData = res.data;
  //     this.doctorsInfo = res.data.doctor_weekly_registration_graph;
  //     this.patientsCount$.next(res.data.weekly_counts);
  //     this.doctorsCount$.next(
  //       this.overviewData.doctor_weekly_registration_graph
  //     );
  //     this.careTeamCount$.next(
  //       this.overviewData.careteam_weekly_registration_graph
  //     );
  //     this.getPatientsInfo(this.selectedPatientInfoType);
  //     this.getDoctorsInfo(this.selectedDoctorInfoType);
  //     this.getCareTeamInfo(this.selectedCareTeamType);
  //   });
  // }

  onPatientChange(value: any) {
    this.getPatientsInfo(value);   
    this.selectedPatientInfoType = value;
  }

  onDoctorChange(value: any) {
    this.getDoctorsInfo(value);
  }

  onCareTeamChange(value: any) {
    this.getCareTeamInfo(value);
  }

  getPatientsInfo(type: string) {
    let filterData = [];
    if (type === 'week') {
      filterData = this.weeklyPatientInfo ? this.weeklyPatientInfo : [];
      this.patientsCount$.next(this.overviewData.weekly_counts);
    }
    if (type === 'month') {
      filterData = this.monthlyPatientInfo ? this.monthlyPatientInfo : [];
      this.patientsCount$.next(this.overviewData.monthly_counts);
    }
    if (type === 'year') {
      filterData = this.yearlyPatientInfo ? this.yearlyPatientInfo : [];
      this.patientsCount$.next(this.overviewData.yearly_counts);
    }
    let key = type;
    let series = {};
    series[key] = [
      {
        data: [],
        name: 'Patients',
      },
    ];
    let chartData = {
      labels: [],
      series: series,
    };
    filterData.forEach((data) => {
      chartData.labels.push(data.type_name);
      chartData.series[key][0].data.push(data.patient_count);
      return chartData;
    });
    this.getPatientsOverviewInfo(chartData);
  }

  getPatientsOverviewInfo(info: any) {
    this.patientsInfoOptions = {
      chart: {
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'line',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ['#64748B', '#94A3B8'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        background: {
          borderWidth: 0,
        },
      },
      grid: {
        borderColor: 'var(--fuse-border)',
      },
      labels: info.labels,
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      series: info.series,
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.75,
          },
        },
      },
      stroke: {
        width: [3, 0],
      },
      tooltip: {
        followCursor: true,
        theme: 'dark',
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          color: 'var(--fuse-border)',
        },
        labels: {
          style: {
            colors: 'var(--fuse-text-secondary)',
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          offsetX: -16,
          style: {
            colors: 'var(--fuse-text-secondary)',
          },
        },
      },
    };
  }

  getDoctorsInfo(type: string) {
    let filterData = [];
    if (type === 'week') {
      filterData = this.overviewData.doctor_weekly_registration_graph ? this.overviewData.doctor_weekly_registration_graph : [];
      this.doctorsCount$.next(
        this.overviewData.doctor_weekly_registration_graph
      );
    }
    if (type === 'month') {
      filterData = this.overviewData.doctor_monthly_registration_graph ? this.overviewData.doctor_monthly_registration_graph : [];
      this.doctorsCount$.next(
        this.overviewData.doctor_monthly_registration_graph
      );
    }
    if (type === 'year') {
      filterData = this.overviewData.doctor_yearly_registration_graph ? this.overviewData.doctor_yearly_registration_graph : [];
      this.doctorsCount$.next(
        this.overviewData.doctor_yearly_registration_graph
      );
    }
    let chartData = {
      labels: [],
      series: [],
    };
    filterData.forEach((data) => {
      chartData.labels.push(data.type_name);
      chartData.series.push(data.percentage);
      return chartData;
    });
    this.getDoctorsOverviewInfo(chartData);
  }

  getDoctorsOverviewInfo(data: any) {
    this.doctorsOptions = {
      chart: {
        animations: {
          speed: 400,
          animateGradually: {
            enabled: false,
          },
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'donut',
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#316635', '#f29f33', '#e94243'],
      labels: data.labels,
      plotOptions: {
        pie: {
          customScale: 0.9,
          expandOnClick: false,
          donut: {
            size: '70%',
          },
        },
      },
      series: data.series,
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
        active: {
          filter: {
            type: 'none',
          },
        },
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'dark',
        custom: ({
          seriesIndex,
          w,
        }): string => `<div class='flex items-center h-8 min-h-8 max-h-8 px-3'>
                                                    <div class='w-3 h-3 rounded-full' style='background-color: ${w.config.colors[seriesIndex]};'></div>
                                                    <div class='ml-2 text-md leading-none'>${w.config.labels[seriesIndex]}:</div>
                                                    <div class='ml-2 text-md font-bold leading-none'>${w.config.series[seriesIndex]}%</div>
                                                </div>`,
      },
    };
  }

  getCareTeamInfo(type: string) {
    let filterData = [];
    if (type === 'week') {
      filterData = this.overviewData.careteam_weekly_registration_graph ? this.overviewData.careteam_weekly_registration_graph : [];
      this.doctorsCount$.next(
        this.overviewData.careteam_weekly_registration_graph
      );
    }
    if (type === 'month') {
      filterData = this.overviewData.careteam_monthly_registration_graph ? this.overviewData.careteam_monthly_registration_graph : [];
      this.doctorsCount$.next(
        this.overviewData.careteam_monthly_registration_graph
      );
    }
    if (type === 'year') {
      filterData = this.overviewData.careteam_yearly_registration_graph ? this.overviewData.careteam_yearly_registration_graph : [];
      this.doctorsCount$.next(
        this.overviewData.careteam_yearly_registration_graph
      );
    }
    let chartData = {
      labels: [],
      series: [],
    };
    filterData.forEach((data) => {
      chartData.labels.push(data.type_name);
      chartData.series.push(data.percentage);
      return chartData;
    });
    this.getCareteamOverviewInfo(chartData);
  }

  getCareteamOverviewInfo(data: any) {
    this.careTeamOptions = {
      chart: {
        animations: {
          speed: 400,
          animateGradually: {
            enabled: false,
          },
        },
        fontFamily: 'inherit',
        foreColor: 'inherit',
        height: '100%',
        type: 'donut',
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#316635', '#f29f33', '#e94243'],
      labels: data.labels,
      plotOptions: {
        pie: {
          customScale: 0.9,
          expandOnClick: false,
          donut: {
            size: '70%',
          },
        },
      },
      series: data.series,
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
        active: {
          filter: {
            type: 'none',
          },
        },
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'dark',
        custom: ({
          seriesIndex,
          w,
        }): string => `<div class='flex items-center h-8 min-h-8 max-h-8 px-3'>
                                                    <div class='w-3 h-3 rounded-full' style='background-color: ${w.config.colors[seriesIndex]};'></div>
                                                    <div class='ml-2 text-md leading-none'>${w.config.labels[seriesIndex]}:</div>
                                                    <div class='ml-2 text-md font-bold leading-none'>${w.config.series[seriesIndex]}%</div>
                                                </div>`,
      },
    };
  }

  getUserInfo(userId: number) {
    this.httpService.get("api/User/GetUsersById?userId=", userId).subscribe(
      (res: any) => {
        this.accountInfo.next(res.data);
      },
      (error: any) => {
        console.warn("error", error);
      }
    );
  }
  getProjectNames(){
    const url = `api/User/GetMasterData?mastercategoryid=`+104;
     this.httpService.getAll(url).subscribe((res: any) => {
        this.projectNames=res.data;
    },
    (error: any) => {
        console.log('error', error);
    });
  }
  filterByCategory(ev){
    console.log(ev.value)
    if(ev.value == 'Hello Kidney'){
      //this.getDashboadInfo('HLKD')
    }else{
      //this.getDashboadInfo('')
    }
    
  }

}
