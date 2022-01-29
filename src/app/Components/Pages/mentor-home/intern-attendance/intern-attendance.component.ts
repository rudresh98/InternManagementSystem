import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { Attendance_History } from 'src/app/_models/attendance-history.model';

@Component({
  selector: 'app-intern-attendance',
  templateUrl: './intern-attendance.component.html',
  styleUrls: ['./intern-attendance.component.scss']
})
export class InternAttendanceComponent implements OnInit {

  displayedColumns: string[] = ['Date', 'CheckIn', 'CheckOut', 'Status', 'Update'];
  dataSource!: MatTableDataSource<Attendance_History>;
  showModal:boolean = false;

  listmodaltask:any;
  userId : any;
  isLoading: boolean = false;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private commonService: CommonService, private snackBar: MatSnackBar, private eventEmitterService: EventEmitterService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userid');
    })
    this.getAttendanceHistory();
    if (this.eventEmitterService.attendanceHistorySub == undefined) {
      this.eventEmitterService.attendanceHistorySub = this.eventEmitterService.
        invokeGetAttendanceHistoryFunction.subscribe(() => {
          this.getAttendanceHistory();
        });
    }
  }

  showmodal(element:any){
    this.showModal=true;

    this.listmodaltask=element.Update
  }

  getAttendanceHistory() {
    this.isLoading = true
    this.commonService.getUserAttedanceHistory(this.userId).subscribe((res) => {
      if (res.status === 200) {

        console.log(res)
        let temparr: any = [];

        res.body.Data.map(
          (ele: any) => {
            const temp = {
              Date: ele.CreatedOn,
              CheckIn: ele.CheckIn,
              CheckOut: ele.CheckOut,
              Status: ele.ApprovalStatus,
              Update: ele.TaskUpdate
            }

            temparr.push(temp)
          }
        )

        console.log("temparr", temparr)



        let resultData: Attendance_History[] = temparr;

        this.dataSource = new MatTableDataSource<Attendance_History>(resultData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      }
      this.isLoading = false;
    }, (error) => {
      if (error === 'Unknown Error') {
        this.snackBar.open('Backend is not running , Please contact to admin', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open(error, 'Close', { duration: 10000 });
      }
      this.isLoading = false;
    })
  }

  

}
