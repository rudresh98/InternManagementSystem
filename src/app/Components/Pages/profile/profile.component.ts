import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/Shared/services/common.service';
import * as moment from 'moment';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  profileData: any;
  datejoining:any;
  constructor(private commonService: CommonService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.isLoading = true; 
    this.commonService.getProfileData().subscribe((res) => {
      if (res.status === 200) {
        this.datejoining = moment(res.body.Data.DateOfJoining).format('YYYY-MM-DD')
        console.log("rpofile", this.datejoining)
        this.profileData = res.body.Data;
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
      }
      this.isLoading = false;
    }, (error) => {
      if (error === 'Unknown Error') {
        this.snackBar.open('Backend is not running , Please contact to admin', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open(error, 'Close', { duration: 5000 });
      }
      this.isLoading = false;
    });
  }

}
