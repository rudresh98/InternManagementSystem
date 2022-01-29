import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { Attendance_History } from 'src/app/_models/attendance-history.model';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss'],
})
export class AttendanceHistoryComponent implements OnInit {
  isLoading: boolean = false;

  displayedColumns: string[] = ['Date', 'CheckIn', 'CheckOut', 'Duration','Status'];
  dataSource!: MatTableDataSource<Attendance_History>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.getAttendanceHistory();
    if (this.eventEmitterService.attendanceHistorySub == undefined) {
      console.log("kldfl");
      this.eventEmitterService.attendanceHistorySub = this.eventEmitterService.invokeGetAttendanceHistoryFunction.subscribe(
        () => {
          this.getAttendanceHistory();
        }
      );
    }
  }

  getAttendanceHistory() {
    this.isLoading = true;
    this.commonService.getAttedanceHistory().subscribe(
      (res) => {
        if (res.status === 200) {
          let temparr: any = [];

          res.body.Data.map((ele: any) => {
            const temp = {
              Date: ele.CreatedOn,
              CheckIn: ele.CheckIn,
              CheckOut: ele.CheckOut,
              Duration: ele.WorkDuration,
              Status: ele.ApprovalStatus,
            };
            if (temp.Duration != null) {
              temp.Duration = temp.Duration.split('.')[0]
            }
            temparr.push(temp);
          });

          console.log('temparr', temparr);

          let resultData: Attendance_History[] = temparr;

          this.dataSource = new MatTableDataSource<Attendance_History>(
            resultData
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource);
        } else if (res.status != 200) {
          this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
        }
        this.isLoading = false;
      },
      (error) => {
        if (error === 'Unknown Error') {
          this.snackBar.open(
            'Backend is not running , Please contact to admin',
            'Close',
            { duration: 5000 }
          );
        } else {
          this.snackBar.open(error, 'Close', { duration: 10000 });
        }
        this.isLoading = false;
      }
    );
  }
}
