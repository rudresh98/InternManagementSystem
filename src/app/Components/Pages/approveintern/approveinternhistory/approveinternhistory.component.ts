import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/Shared/services/common.service';
import { Intern_History } from 'src/app/_models/intern-history.model';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-approveinternhistory',
  templateUrl: './approveinternhistory.component.html',
  styleUrls: ['./approveinternhistory.component.scss'],
})
export class ApproveinternhistoryComponent implements OnInit {
  isLoading: boolean = false;
  listmodaltask:any;
  showModal:boolean = false;

  displayedColumns: string[] = [
    'Date',
    'UserId',
    'Name',
    'CheckIn',
    'CheckOut',
    'Status',
    'Duration',
    'Update',
    'Action',
    
  ];
  dataSource!: MatTableDataSource<Intern_History>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getinternhistory();
  }
  showmodal(element:any){
    this.showModal=true;

    this.listmodaltask=element.Update
  }

  getinternhistory() {
    this.isLoading = true;
    this.commonService.oninternhistory().subscribe(
      (res) => {
        console.warn('intern history', res);
        if (res.status === 200) {
          console.warn('success attendance');
          console.warn(res.body.Data);
          let temparr: any = [];

          res.body.Data.map((ele: any) => {
            const temp = {
              Date: ele.CreatedOn,
              UserId: ele.UserID,
              Name: ele.FullName,
              CheckIn: ele.CheckIn,
              CheckOut: ele.CheckOut,
              Duration: ele.WorkDuration,
              Status: ele.ApprovalStatus,
              Update:ele.TaskUpdate
            };
            if (temp.Duration != null) {
              temp.Duration = temp.Duration.split('.')[0]
            }
            temparr.push(temp);
          });
          console.log('temparr', temparr);
          let resultData: Intern_History[] = temparr;

          this.dataSource = new MatTableDataSource<Intern_History>(resultData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(this.dataSource);
        } else if (res.body != 200) {
          // this.snackBar.open(res.Message, 'Close', { duration: 1500 });
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
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
        this.isLoading = false;
      }
    );
  }

  oninternstatus(element: any, decision:string) {
    console.warn("dfdadfa", element)
    this.commonService.getinternstatus(element.Date,element.UserId,decision).subscribe(res => {
        console.log("asdfgg", res);
        this.getinternhistory();
      }
    )
  }
  DoFilter(event:any)
  {
    console.log(event)
    
    this.dataSource.filter = event.target.value.trim().toLowerCase();

  }
}
