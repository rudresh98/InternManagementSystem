import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';

export interface User {
  UserId: string,
  Name: string;
  // CurrentProject: string;
  Mentor: string,
  Status: boolean
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumns: string[] = 
  ['Name', 'Mentor', 'Status'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  public searchForm!: FormGroup;
  Name: string = '';

  constructor(private commonService: CommonService,
     private snackBar: MatSnackBar, 
     public dialog: MatDialog,
      private eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.getUserList();
    if (this.eventEmitterService.userDetailSub == undefined) {
      this.eventEmitterService.userDetailSub = this.eventEmitterService.
        invokeGetUserDetailFunction.subscribe(() => {
          this.getUserList();
        });
    }
    this.searchFormInit();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.Name.toLowerCase().indexOf(filter) === 0;
    }
  }

  searchFormInit() {
    this.searchForm = new FormGroup({
      // masterId: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      Name: new FormControl('', Validators.pattern('^[a-zA-Z ]+$')),
      // masterType: new FormControl('', Validators.pattern('^[a-zA-Z ]+$'))
    });
  }

  onInputChange(event: any, element: any) {
    console.log("Name  : ", element.Name, " Status : ", event.target.checked)
    let payload = {
      UserID: element.UserId,
      UserStatus: event.target.checked ? "Enable" : "Disable"
    }
    this.commonService.updateUserDetails(payload).subscribe((res) => {
      if (res.status === 200) {
        console.log(res);
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      }
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
    })
  }

  getUserList() {
    this.isLoading = true;
    this.commonService.getUserList().subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        let temparr: any = [];
        res.body.Data.map(
          (ele: any) => {
            const temp = {
              UserId: ele.UserID,
              Name: ele.FullName,
              // CurrentProject: ele.CurrentProject,
              Mentor: ele.Mentor,
              Status: ele.UserStatus == "Enable" ? true : false,
            }
            temparr.push(temp)
          }
        )
        this.dataSource = new MatTableDataSource<User>(temparr);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          return data.Name.toLowerCase().indexOf(filter) === 0;
        }
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      }
      this.isLoading = false;
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
    })
  }

  openUserProfile(element: any) {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.userId = element.UserId;
  }

  DoFilter(event: any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
}
