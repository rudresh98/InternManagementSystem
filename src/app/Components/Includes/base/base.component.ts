import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { User } from 'src/app/_models/user.model';
import { CommonService } from 'src/app/Shared/services/common.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  show = false
  currentUser!: User;
  isSSO!: boolean;
  firstName!: string;
  lastName!: string;
  navopen=false
  checkrole: string = '';
  mobileQuery!: MediaQueryList;

  private _mobileQueryListener: () => void;
  loading: boolean = false;

  constructor(private router: Router,
    private commonservice: CommonService,
    private authService: AuthService,
    private authServiceAD: MsalService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public dialog: MatDialog) {
    this.router.events.subscribe((event: Event) => {
      // console.log(event)
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
      if (this.currentUser != null) {
        this.isSSO = this.currentUser.LoginMethod == 'sso' ? true : false;
        this.firstName = this.currentUser.FirstName;
        this.lastName = this.currentUser.LastName;
      }
    });
  }

  ngOnInit(): void {
    let role = JSON.parse(localStorage.currentUser).Role;
    console.log("role ", role)
    if (role == "HR") {
      this.checkrole = "HR";
    }
    else if (role == "Mentor") {
      this.checkrole = "Mentor";
    }
    else if (role == "Intern") {
      this.checkrole = "Intern";
    }
    // this.checkrole=this.commonservice.getrolenname()==="test"?true:false

    // console.log("role chekc",this.checkrole)

    console.log("ROLEL : ", this.checkrole)
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout() {
    this.authService.logout();
    if (this.isSSO) {
      this.authServiceAD.logout();
    }
    this.router.navigate(['/login']);
  }

  openUserProfile() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '500px'
    });
  }
  toggle(){
    this.navopen=!this.navopen
  }



}
