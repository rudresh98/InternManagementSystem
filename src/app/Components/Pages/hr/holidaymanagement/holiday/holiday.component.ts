import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HolidayAddComponent } from '../holiday-add/holiday-add.component';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {
  

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  onAddHoliday(){
    const dialogRef = this.dialog.open(HolidayAddComponent,);
  }

}
