import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CountupTimerService, countUpTimerConfigModel } from 'ngx-timer';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskShowComponent } from './attendance-history/task-show/task-show.component';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  isCheckInLoading!: boolean;
  IsWorkingDay!: boolean;
  attendanceStatus: string = '';
  testConfig: any;
  value: string = 'Check-in';
  todayDate = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();

  public currentTime: Date = new Date();
  @ViewChild('appAttendanceHistory') appAttendanceHistory: any;
  showTimer: boolean = true;
  workingTime: any;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private countupTimerService: CountupTimerService,
    private eventEmitterService: EventEmitterService,
    public dialog: MatDialog
  ) {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1);
  }

  ngOnInit(): void {
    this.testConfig = new countUpTimerConfigModel();
    this.getAttendanceStatus();
  }

  timeUpdate() {
    let dateFormat = require('dateformat');
    if (this.value == 'Check-in') {
      this.value = 'Check-out';
      this.startTime = dateFormat(this.currentTime, 'isoTime');
      this.snackBar.open('You are checkedin', 'close', { duration: 2000 });
      this.countupTimerService.startTimer();
      console.log('start Time: ', this.startTime);
      this.commonService.checkinLog().subscribe(
        (res) => {
          console.log('success', res);
        },
        (err: HttpErrorResponse) => {
          console.log('Error', err);
        }
      );
    } else {
      this.value = 'Check-in';
      this.endTime = dateFormat(this.currentTime, 'isoTime');
      this.countupTimerService.stopTimer();
      this.snackBar.open('You are checked out', 'close', { duration: 1000 });
      console.log('End Time: ', this.endTime);
      this.commonService.checkoutLog().subscribe(
        (res) => {
          console.log('success', res);
          this.appAttendanceHistory.getAttendanceHistory();
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    }
  }

  updateAttendanceStatus(status: any) {
    console.log(status);
    this.isCheckInLoading = true;
    if (status == 'checkin') {
      this.commonService.checkinLog().subscribe(
        (res) => {
          console.log(res);
          if (res.status === 200) {
            this.getAttendanceStatus();
          } else if (res.status != 200) {
            this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
          }
          this.isCheckInLoading = false;
          this.eventEmitterService.onCheckInOutUpdate();
        },
        (error) => {
          if (error === 'Unknown Error') {
            this.snackBar.open(
              'Backend is not running , Please contact to admin',
              'Close',
              { duration: 5000 }
            );
          } else {
            this.snackBar.open(error, 'Close', { duration: 5000 });
          }
          this.isCheckInLoading = false;
        }
      );
    } else if (status == 'checkout') {
      const dialogRef = this.dialog.open(TaskShowComponent, {
        width: '600px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getAttendanceStatus();
        this.isCheckInLoading = true;
      })
    }
  }

  getAttendanceStatus() {
    let moment = require('moment');
    this.isCheckInLoading = true;
    this.commonService.getAttedanceStatus().subscribe(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          this.IsWorkingDay = res.body.Data.IsWorkingDay;
          this.attendanceStatus = res.body.Data.Status;
          if(res.body.Data.CheckInTime == null && res.body.Data.CheckOutTime == null){
            this.showTimer = true;
            this.countupTimerService.stopTimer();
          }else if (res.body.Data.CheckInTime != null && res.body.Data.CheckOutTime == null){
            this.showTimer = true;
            this.countupTimerService.startTimer(res.body.Data.CheckInTime);
          }else if (res.body.Data.CheckInTime != null && res.body.Data.CheckOutTime != null){
            this.showTimer = false;
            var startTime = moment(res.body.Data.CheckInTime, "YYYY MM DD HH:mm:ss");
            var endTime = moment(res.body.Data.CheckOutTime, "YYYY MM DD HH:mm:ss");
            // var startTime = moment("2021-01-09T17:20:17.472", "HH:mm:ss");
            // var endTime = moment( "2021-01-09T18:06:32.959", "HH:mm:ss");
            var duration = moment.duration(endTime.diff(startTime));
            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes())%60;
            var seconds = parseInt(duration.asSeconds())%60;
            this.workingTime = hours + 'hh '+ minutes+'mm ' + seconds+'ss';
          }
        } else if (res.status != 200) {
          this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
        }
        this.isCheckInLoading = false;
      },
      (error) => {
        if (error === 'Unknown Error') {
          this.snackBar.open(
            'Backend is not running , Please contact to admin',
            'Close',
            { duration: 5000 }
          );
        } else {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
        this.isCheckInLoading = false;
      }
    );
    
  }
  // opentaskupdate(){
  //   const dialogRef = this.dialog.open(TaskShowComponent, {
  //     width: '600px'
  //   });
  // }
}
