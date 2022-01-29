import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CountupTimerService, countUpTimerConfigModel } from 'ngx-timer';
import { CommonService } from 'src/app/Shared/services/common.service';

@Component({
  selector: 'app-approveintern',
  templateUrl: './approveintern.component.html',
  styleUrls: ['./approveintern.component.scss'],
})
export class ApproveinternComponent implements OnInit {
  isCheckInLoading!: boolean;
  attendanceStatus: string = 'Pending';
  testConfig: any;
  value: string = 'Check-in';
  todayDate = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();

  rolecheck: string = '';

  public currentTime: Date = new Date();

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    private countupTimerService: CountupTimerService
  ) {}

  ngOnInit(): void {}
}
