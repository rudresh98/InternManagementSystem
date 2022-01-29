import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';


export interface Holiday {
  Description: string;
  StartDate: string;
  EndDate: string;
}
@Component({
  selector: 'app-holiday-add',
  templateUrl: './holiday-add.component.html',
  styleUrls: ['./holiday-add.component.scss'],
})
export class HolidayAddComponent implements OnInit {
  holidayprofile!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<HolidayAddComponent>
  ) {}
  isCheckInLoading!: boolean;
  ngOnInit(): void {
    this.declareHoliday();
    // this.holidayRegistration();
  }
  async holidayadd() {
    let payload = {
      Description: this.holidayprofile.value.Description,
      StartDate: this.holidayprofile.value.StartDate,
      EndDate: this.holidayprofile.value.EndDate,
    };
    console.log(payload);
    this.dialogRef.close('closed');
    let s_date = new Date(payload.StartDate);
    // const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(s_date);
    // const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(s_date);
    // const month = s_date.getMonth()+1;
    // const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(s_date);
    // const ndate = `${ye}-${month}-${da}`
    // console.log(ndate);
    let e_date = new Date(payload.EndDate);
    e_date.setDate(e_date.getDate() + 1);
    let p_load: any = [];

    while (s_date.toDateString() !== e_date.toDateString()) {
      let tempDate = new Date(s_date);
      let temp = {
        HolidaysDate: `${tempDate.getFullYear()}-${
          tempDate.getMonth() + 1
        }-${tempDate.getDate()} `,
        HolidayDescription: payload.Description,
      };
      await p_load.push(temp);
      s_date.setDate(s_date.getDate() + 1);
    }
    console.log(p_load);

    this.commonservice.HolidayRegistration(p_load).subscribe(
      (res) => {
        console.log('holiadaycreate', res);
        if (res.status === 200 || res.status === 201) {
          console.log(res);
          this.dialogRef.close(res.body.Message);
          this.eventEmitterService.onHolidayManagmentUpdate();
          //this.getUserList();
          this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
        } else if (res.status != 200) {
          this.dialogRef.close(res.body.Message);
          this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
        }
        this.isCheckInLoading = false;
      },
      (error) => {
        if (error === 'Unknown Error') {
          this.dialogRef.close(error);
          this.snackBar.open(
            'Backend is not running , Please contact to admin',
            'Close',
            { duration: 5000 }
          );
        } else {
          this.dialogRef.close(error);
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
        this.isCheckInLoading = false;
      }
    );
    // this.holidaymangemnt.getholiday();
  }
  declareHoliday() {
    this.holidayprofile = new FormGroup({
      Description: new FormControl('', Validators.required),
      StartDate: new FormControl('', Validators.required),
      EndDate: new FormControl('', Validators.required),
    });
  }
}
