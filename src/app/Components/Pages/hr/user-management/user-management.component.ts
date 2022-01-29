import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { UserAddComponent } from './user-add/user-add.component';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {}

  onAddUser(): void {
    const dialogRef = this.dialog.open(UserAddComponent,);
  }
}
