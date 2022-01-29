import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';

export interface Regular {
  UserId: string;
  ApprovalStatus: string;
  ApprovalStatusDate: string;
  CreatedOn: string;
  WorkingDuration: boolean;
  CheckIn: string;
  Checkout: string;
}
@Component({
  selector: 'app-mentor-regularization',
  templateUrl: './mentor-regularization.component.html',
  styleUrls: ['./mentor-regularization.component.scss']
})
export class MentorRegularizationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService
  ) {}
  displayedColumns: string[] = [
    'UserId',
    "FullName",
    'ApprovalStatus',
    'CreatedOn',
    'CheckIn',
    'Action'
  ];
  dataSource = new MatTableDataSource<Regular>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  isLoading: boolean = false;
  ngOnInit(): void {
    this.setregularization();
    if (this.eventEmitterService.userDetailSub == undefined) {
      this.eventEmitterService.userDetailSub = this.eventEmitterService.invokeGetUserDetailFunction.subscribe(
        () => {
          this.setregularization();
        }
      );
    }
  }
  setregularization() {
    this.commonservice.getRegularizationMentorSide().subscribe(
      (res) => {
        console.log('regu', res);
        if (res.status === 200) {
          let temparr: any = [];
          res.body.Data.map((ele: any) => {
            const temp = {
              ApprovalStatus: ele.ApprovalStatus,
              CheckIn: ele.CheckIn,
              CreatedOn: ele.CreatedOn,
              UserID: ele.UserID,
              FullName:ele.FullName
            };
           
            temparr.push(temp);
            console.log(temparr);
          }
        );
          this.dataSource = new MatTableDataSource<Regular>(temparr);
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
  oninternstatus(element: any, decision:string) {
    console.warn("dfdadfa", element)
    this.commonservice.getinternstatus(element.CreatedOn,element.UserID,decision).subscribe(res => {
        console.log("asdfgg", res);
        this.setregularization();
      }
    )
  }
  DoFilter(event:any)
  {
    console.log(event)
    
    this.dataSource.filter = event.target.value.trim().toLowerCase();

  }
}
