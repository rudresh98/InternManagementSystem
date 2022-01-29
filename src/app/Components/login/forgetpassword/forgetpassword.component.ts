import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {
  userprofile !: FormGroup;
  isLoading: boolean = false;
  hide: boolean = true
  constructor(
    private snackBar: MatSnackBar,
    private commonservice: CommonService,

    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<ForgetpasswordComponent>
  ) { }

  ngOnInit(): void {
    this.declareform();
  }
  declareform() {
    this.userprofile = new FormGroup({
      forgetemailaddress: new FormControl("", Validators.required),

    },
    )
  }



  // forget pass
  forgetPassword() {

    this.isLoading = true;
    let email = this.userprofile.value.forgetemailaddress

    this.commonservice.forgetPassword(email)
    .subscribe((res) => {
      this.dialogRef.close(res.body.Message);

      if (res.status === 200) {
        console.log("forget pass", res);
        this.declareform();
        this.snackBar.open(res.body.Data.Status, 'Close', { duration: 3000 });
        //this.eventEmitterService.onUserDetailUpdate();
      } else if (res.status != 200) {

        // this.dialogRef.close(res.body.Message);
        this.snackBar.open(res.body.Data.Status, 'Close', { duration: 3000 });

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
}
