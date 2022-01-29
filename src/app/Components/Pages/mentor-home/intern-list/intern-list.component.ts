import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { InternProfileComponent } from '../intern-profile/intern-profile.component';

export interface User {
  UserId: string;
  Name: string;
  CurrentProject: string;
  ProjectMentor: string;
  EmailAddress: string;
  OrganizationEmailAddress: string;
}

@Component({
  selector: 'app-intern-list',
  templateUrl: './intern-list.component.html',
  styleUrls: ['./intern-list.component.scss'],
})
export class InternListComponent implements OnInit {
  displayedColumns: string[] = [
    'UserID',
    'Name',
    'EmailAddress',
    'OrganizationEmailAddress',
    'ContactNo'
  ];
  dataSource = new MatTableDataSource<User>();
  isLoading: boolean = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.getInternList();
    if (this.eventEmitterService.userDetailSub == undefined) {
      this.eventEmitterService.userDetailSub = this.eventEmitterService.invokeGetUserDetailFunction.subscribe(
        () => {
          this.getInternList();
        }
      );
    }
  }

  getInternList() {
    this.isLoading = true;
    this.commonService.getInternList().subscribe(
      (res) => {
        console.log(res);
        if (res.status === 200) {
          let temparr: any = [];
          res.body.Data.map((ele: any) => {
            const temp = {
              UserID: ele.UserID,
              Name: ele.FullName,
              CurrentProject: ele.CurrentProject,
              ProjectMentor: ele.ProjectMentor,
              EmailAddress: ele.EmailAddress,
              OrganizationEmailAddress: ele.OrganizationEmailAddress,
              ContactNo:ele.ContactNo
            };
            temparr.push(temp);
          });
          this.dataSource = new MatTableDataSource<User>(temparr);
          this.dataSource.paginator = this.paginator;
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
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
        this.isLoading = false;
      }
    );
  }

  openUserProfile(element: any) {
    const dialogRef = this.dialog.open(InternProfileComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.userId = element.UserID;
  }

  DoFilter(event:any)
  {
    console.log(event)
    
    this.dataSource.filter = event.target.value.trim().toLowerCase();

  }
}
