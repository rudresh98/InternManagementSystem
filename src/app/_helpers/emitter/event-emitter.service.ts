import { EventEmitter, Injectable } from '@angular/core';
import { Emitter } from '@fullcalendar/angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {

  invokeGetAttendanceHistoryFunction = new EventEmitter();

  invokeGetUserDetailFunction = new EventEmitter();
  attendanceHistorySub!: Subscription | undefined;
  userDetailSub!: Subscription | undefined;

  invokeGetHolidayDetailFunction = new EventEmitter();
  HolidayHistorySub!: Subscription | undefined;

  invokeGetProjectDetail = new EventEmitter();
  ProjectDetailSub!: Subscription | undefined;

  constructor() {}

  onCheckInOutUpdate() {
    console.log('CheckIN.Checkout');
    this.invokeGetAttendanceHistoryFunction.emit();
  }

  onUserDetailUpdate() {
    console.log('UPDate');
    this.invokeGetUserDetailFunction.emit();
  }
  onHolidayManagmentUpdate() {
    console.log('holiday');
    this.invokeGetHolidayDetailFunction.emit();
  }

  onProjectManagementUpdate(){
    console.log("project management")
    this.invokeGetProjectDetail.emit()
  }
}
