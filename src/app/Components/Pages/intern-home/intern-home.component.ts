import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/Shared/services/common.service';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent implements OnInit {
  isLoading: boolean = false;
  attendanceData: any;
  CurrentMonthAbsent: any;
  CurrentMonthPending: any;
  CurrentMonthPresent: any;
  CurrentMonthWorkingDaysTotal: any;
  dateevents: any;
  eventColorCode: any = {
    'Weekend': '#BC8F8F',
    'Pending': '#FFC107',
    'Absent': '#DC143C',
    'Present': '#3CB371',
    "Holiday": '#4169E1'
  }
  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {

  }
  @ViewChild('fullcalendar')
  calendarComponent!: FullCalendarComponent;

  switch_fullyear: any = '';
  switch_month: any = '';

  ngOnInit(): void {
    // this.getTotalAttendanceReport();
    this.attendencedays();

    let current_time = new Date()
    let current_month = current_time.getMonth() + 1;
    let current_year = current_time.getFullYear()
    this.getcalevents(current_month, current_year);
    // let calendarApi = this.calendarComponent.getApi();
    // console.log('calendarapidate', calendarApi.currentData.currentDate); // call a method on the Calendar object
    // let currentdate = new Date(calendarApi.currentData.currentDate);
    // this.switch_fullyear = currentdate.getFullYear();
    // this.switch_month = currentdate.getMonth() + 1;
    // console.log("year0",this.switch_fullyear);
    // console.log("moth",this.switch_month);
    // console.log("get")
    // console.log("get caleed")
  }


  // getTotalAttendanceReport() {
  //   this.isLoading = true;
  //   this.commonService.getTotalAttendance().subscribe(
  //     (res) => {
  //       console.log(res);
  //       if (res.status === 200) {
  //         this.attendanceData = res.body.Data;
  //         console.log('asdsad', this.attendanceData);
  //       } else if (res.status != 200) {
  //         this.snackBar.open(res.body.Message, 'Close', { duration: 1000 });
  //       }
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       if (error === 'Unknown Error') {
  //         this.snackBar.open(
  //           'Backend is not running , Please contact to admin',
  //           'Close',
  //           { duration: 5000 }
  //         );
  //       } else {
  //         this.snackBar.open(error, 'Close', { duration: 5000 });
  //       }
  //       this.isLoading = false;
  //     }
  //   );
  // }

  attendencedays() {
    this.isLoading = true;
    this.commonService.getattendancecards().subscribe((res) => {
      console.log('attendece res', res);
      this.CurrentMonthAbsent = res.body.Data.CurrentMonthAbsent;
      this.CurrentMonthPending = res.body.Data.CurrentMonthPending;
      this.CurrentMonthPresent = res.body.Data.CurrentMonthPresent;
      this.CurrentMonthWorkingDaysTotal = res.body.Data.CurrentMonthWorkingDaysTotal;
      console.log(this.CurrentMonthAbsent);
      // return this.CurrentMonthAbsent;
    }, (error) => {
      if (error === 'Unknown Error') {
        this.snackBar.open(
          'Backend is not running , Please contact to admin',
          'Close',
          { duration: 5000 }
        );
      } else {
        this.snackBar.open(error, 'Close', { duration: 5000 });
      }
      this.isLoading = false;
    });
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {},
    customButtons: {
      today: {
        text: "Today",
        click: this.onToday.bind(this)
      },
      next: {
        text: 'next',
        click: this.onNext.bind(this),
      },
      prev: {
        text: 'prev',
        click: this.onPrev.bind(this),
      },
    },
    initialView: 'dayGridMonth',
    // dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [],
  };
  onToday(selectInfo: any) {
    const calendarApi = this.calendarComponent.getApi();
    // ​​​​​ const calendarApi = this.calendarComponent.getApi();
    //  calendarApi.next(); // call a method on the Calendar object

    console.log('calendarapidate', calendarApi.currentData.currentDate); // call a method on the Calendar object
    calendarApi.today();
    let currentdate = new Date(calendarApi.currentData.currentDate);
    this.switch_fullyear = currentdate.getFullYear();
    this.switch_month = currentdate.getMonth() + 1;
    console.log('selc', calendarApi);
    this.getcalevents(this.switch_month, this.switch_fullyear);
  }



  onNext(selectInfo: any) {
    const calendarApi = this.calendarComponent.getApi();
    // ​​​​​ const calendarApi = this.calendarComponent.getApi();
    //  calendarApi.next(); // call a method on the Calendar object
    console.log('calendarapidate', calendarApi.currentData.currentDate); // call a method on the Calendar object
    calendarApi.next();
    let currentdate = new Date(calendarApi.currentData.currentDate);
    this.switch_fullyear = currentdate.getFullYear();
    this.switch_month = currentdate.getMonth() + 1;
    console.log('selc', calendarApi);
    this.getcalevents(this.switch_month, this.switch_fullyear);
  }
  onPrev() {
    let calendarApi = this.calendarComponent.getApi();
    console.log('calendarapidate', calendarApi.currentData.currentDate); // call a method on the Calendar object
    calendarApi.prev();
    let currentdate = new Date(calendarApi.currentData.currentDate);
    this.switch_fullyear = currentdate.getFullYear();
    this.switch_month = currentdate.getMonth() + 1;
    this.getcalevents(this.switch_month, this.switch_fullyear);
  }

  // handleDateClick(arg: any) {
  //   alert('date click! ' + arg.dateStr);
  // }

  getcalevents(month: any, year: any) {
    this.isLoading = true;
    this.commonService
      .getcalendarevents(month, year)
      .subscribe((res) => {
        let eventDates = res.body.Data
        let eventArray = []
        for (let key of Object.keys(eventDates)) {
          let obj = {
            title: eventDates[key],
            date: key,
            color: this.eventColorCode[eventDates[key]]
          }
          eventArray.push(obj)
        }
        this.calendarOptions.events = eventArray;
      });
  }
}
