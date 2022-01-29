import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { RSA_NO_PADDING } from 'constants';

@Component({
  selector: 'app-holiday-profile',
  templateUrl: './holiday-profile.component.html',
  styleUrls: ['./holiday-profile.component.scss'],
})
export class HolidayProfileComponent implements OnInit {
  isLoading: boolean = false;

  HolidaysDate: string = ' ';

  Holidayprofile!: FormGroup;
  HolidaysDesc:any;
  formDisabled: boolean = true;

  formerror: any = {
    holidaydesc: '',
  };

  holidaydetails: any;
  validationMessages: any = {
    holidaydesc: {
      required: 'Edit Holiday.',
    },
  };
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
  ngOnInit(): void {
    this.getHolidayDetails(this.HolidaysDate)
    this.getinitial();
    this.declareholiday();
  }
  getinitial() {
    this.holidaydetails = {
      holidaydesc: this.HolidaysDesc,
    };
    return this.holidaydetails.holidaydesc
  }
  enableEdit() {
    this.formDisabled = false;
    this.declareholiday();
  }
  changeHolidayDetails() {
    const moment = require('moment');
    this.isLoading = true;
    let payload = {
      HolidayDescription: this.Holidayprofile.value.holidaydesc,
      HolidaysDate:moment(this.HolidaysDate).format("YYYY-MM-DD")
    };
    console.log("holidayupdate",this.Holidayprofile.value.holidaydesc)
    console.log("holidayupdatedate",this.Holidayprofile.value.HolidaysDate)

    console.log("payloadvalaholidaydesc",payload);
    this.commonservice.updateHoliday(payload,this.HolidaysDate).subscribe(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          console.log("ggg",res.body.HolidaysDate,res.body.HolidayDescription)
          // let date = res.body.Data.HolidaysDate;
          this.getHolidayDetails(res.body.HolidaysDate);
          this.formDisabled = true;
          this.declareholiday();
          this.eventEmitterService.onHolidayManagmentUpdate();
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

  getHolidayDetails(HolidaysDate:string) {
    this.isLoading = true;
    this.commonservice.getsingleholidayapi(HolidaysDate).subscribe(
      (res) => {
        if (res.status === 200) {
          console.log("holidaydetails",res);
          this.HolidaysDesc = res.body.Data.HolidayDescription;
          this.getinitial();
          console.log("initial",this.getinitial());
          // this.holidaydetails.holidaydesc = res.body.Data.HolidayDescription
        } else if (res.status != 200) {
          this.snackBar.open(res.body.Message, 'Close', { duration: 1000 });
        }
        this.isLoading = false;
      },
      (error) => {
        this.getinitial();
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

  declareholiday() {
    this.Holidayprofile = this.fb.group({
      holidaydesc: [
        {
          value: this.holidaydetails.holidaydesc,
          disabled: this.formDisabled,
        },
        [Validators.required],
      ],
      HolidaysDate: [
        {
          value: this.HolidaysDate,
          disabled: true,
        },
        [Validators.required],
      ],
    });
  }
  deleteHoliday(){
    this.isLoading = true;
    this.commonservice.deleteholiday(this.HolidaysDate).subscribe((res) => {
      if (res.status === 200 || res.status === 204) {
        console.log(res);
        this.eventEmitterService.onHolidayManagmentUpdate();
        this.snackBar.open("Holiday Deleted", 'Close', { duration: 10000 });
      } else if (res.status != 200) {
        this.snackBar.open("Error", 'Close', { duration: 10000 });
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
    });
  }
  
}
