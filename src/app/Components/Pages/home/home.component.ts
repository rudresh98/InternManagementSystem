import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  role: string = '';

  constructor() { }

  ngOnInit(): void {
    this.role = JSON.parse(localStorage.currentUser).Role;
  }

}
