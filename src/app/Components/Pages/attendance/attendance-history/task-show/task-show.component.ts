import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-task-show',
  templateUrl: './task-show.component.html',
  styleUrls: ['./task-show.component.scss'],
})
export class TaskShowComponent implements OnInit {
  userprofile!: FormGroup;
  isLoading: boolean = false;
  hide: boolean = true;
  constructor(
    private snackBar: MatSnackBar,
    private commonservice: CommonService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TaskShowComponent>,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.declareform();
  }

  declareform() {
    this.userprofile = new FormGroup({
      taskupdate: new FormControl('', Validators.required),
    });
  }

  async taskupdate() {
    this.isLoading = true;
    let taskdetail = this.userprofile.value.taskupdate;
    this.commonservice.checkoutUser(taskdetail).subscribe(
      (res: any) => {
        console.log('taskupdate', res);
        this.dialogRef.close(res.body.Message);
        if (res.status === 200) {
          console.log('task ', res);
          this.declareform();
          this.snackBar.open(res.body.Message, 'Close', { duration: 5000 });
        } else if (res.status != 200) {
          this.snackBar.open(res.body.Message, 'Close', { duration: 5000 });
        }
        this.eventEmitterService.onCheckInOutUpdate();
        this.isLoading = false;
      },
      (error:any) => {
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

  // taskModificationUser() {
  //   let taskdetail = this.userprofile.value.taskupdate;
  //   this.commonservice.taskUpdate(taskdetail).subscribe(
  //     (res) => {
  //       console.log('taskupdate', res);
  //       this.dialogRef.close(res.body.Message);

  //       if (res.status === 200) {
  //         console.log('task ', res);
  //         this.declareform();
  //         this.snackBar.open(res.body.Message, 'Close', { duration: 5000 });
  //       } else if (res.status != 200) {
  //         this.snackBar.open(res.body.Message, 'Close', { duration: 5000 });
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
  // async checkoutUser() {
  //   this.commonservice.checkoutLog().subscribe(
  //     (res) => {
  //       if (res.status === 200 || res.status === 201) {
  //         this.taskModificationUser();
  //       } else if (res.status != 200) {
  //         this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
  //       }
  //       this.eventEmitterService.onCheckInOutUpdate();
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
  //     }
  //   );
  // }
}
