import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { HolidayProfileComponent } from './holiday-profile/holiday-profile.component';


export interface Holiday {
  CreatedOn: any;
  HolidayDescription: string;
  HolidaysDate: any;
}

@Component({
  selector: 'app-holidaymanagement',
  templateUrl: './holidaymanagement.component.html',
  styleUrls: ['./holidaymanagement.component.scss'],
})
export class HolidaymanagementComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumns: string[] = [
    'HolidaysDate',
    'HolidayDescription',
  ];
  dataSource = new MatTableDataSource<Holiday>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.getholiday();
    if (this.eventEmitterService.HolidayHistorySub == undefined) {
      this.eventEmitterService.HolidayHistorySub = this.eventEmitterService.
      invokeGetHolidayDetailFunction.subscribe(() => {
          this.getholiday();
        });
    }
  }

  getholiday() {
    this.isLoading = true;
    this.commonService.getholidaylistapi().subscribe((res) => {
      console.log('res holiday', res);
      if (res.status === 200) {
        let temarr: any = [];
        res.body.Data.map((ele: any) => {
          const temp = {
            HolidayDescription: ele.HolidayDescription,
            HolidaysDate: ele.HolidaysDate,
          };
          temarr.push(temp);
          console.log("temparr",temarr)
        });
        this.dataSource = new MatTableDataSource<Holiday>(temarr);
        this.dataSource.paginator = this.paginator;
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 1000 });
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
  OpenHolidayEdit(element:any){
    console.log("openholidaylistedit clicked")
    const dialogRef = this.dialog.open(HolidayProfileComponent, {
      width: '500px'
    });
    dialogRef.componentInstance.HolidaysDate = element.HolidaysDate;
    dialogRef.componentInstance.HolidaysDesc = element.HolidayDescription;
  }
  DoFilter(event:any)
  {
    console.log(event)
    
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
}
