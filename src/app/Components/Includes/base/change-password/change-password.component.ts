import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  userprofile !: FormGroup;
  isLoading: boolean = false;
  hide: boolean = true
  constructor(private snackBar: MatSnackBar,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.declareform();
  }



  declareform() {
    this.userprofile = new FormGroup({
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      currentPassword: new FormControl('', Validators.required),
    },
    )
  }


  changePassword(newPassword: any, confirmPassword: any) {

    if (newPassword === confirmPassword) {
      this.isLoading = true;
      let payload = {
        CurrentPassword: btoa(this.userprofile.value.currentPassword),
        Password: btoa(this.userprofile.value.confirmPassword),
      }
      this.commonservice.changePassword(payload).subscribe((res) => {
        if (res.status === 200) {
          console.log(res);
          this.declareform();
          this.dialogRef.close(res.body.Message);
          this.snackBar.open("Password is Updated", 'Close', { duration: 10000 });
          //this.eventEmitterService.onUserDetailUpdate();
        } else if (res.status != 200) {
          this.dialogRef.close(res.body.Message);
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
    else {
      this.snackBar.open("Password Doesn't Match !", "Close", { duration: 5000 })
    }
  }

}
