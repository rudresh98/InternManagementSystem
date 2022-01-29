import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { NgxTimerModule } from 'ngx-timer';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/Pages/home/home.component';
import { LoadingSpinnerComponent } from './Components/Includes/loading-spinner/loading-spinner.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProfileComponent } from './Components/Pages/profile/profile.component';
import { BaseComponent } from './Components/Includes/base/base.component';
import { ErrorInterceptor } from './_helpers/error/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt/jwt.interceptor';
import { AttendanceComponent } from './Components/Pages/attendance/attendance.component';
import { MentorComponent } from './Components/Pages/mentor/mentor.component';
import { AdminComponent } from './Components/Pages/admin/admin.component';
import { HrComponent } from './Components/Pages/hr/hr.component';
import { AttendanceHistoryComponent } from './Components/Pages/attendance/attendance-history/attendance-history.component';
import { ApproveinternComponent } from './Components/Pages/approveintern/approveintern.component';
import { ApproveinternhistoryComponent } from './Components/Pages/approveintern/approveinternhistory/approveinternhistory.component';
import { UserManagementComponent } from './Components/Pages/hr/user-management/user-management.component';
import { UserListComponent } from './Components/Pages/hr/user-management/user-list/user-list.component';
import { UserAddComponent } from './Components/Pages/hr/user-management/user-add/user-add.component';
import { UserProfileComponent } from './Components/Pages/hr/user-management/user-profile/user-profile.component';
import { UserAttendanceComponent } from './Components/Pages/hr/user-management/user-attendance/user-attendance.component';
import { MentorHomeComponent } from './Components/Pages/mentor-home/mentor-home.component';
import { InternListComponent } from './Components/Pages/mentor-home/intern-list/intern-list.component';
import { InternAttendanceComponent } from './Components/Pages/mentor-home/intern-attendance/intern-attendance.component';
import { InternProfileComponent } from './Components/Pages/mentor-home/intern-profile/intern-profile.component';
import { ChangePasswordComponent } from './Components/Includes/base/change-password/change-password.component';
import { InternHomeComponent } from './Components/Pages/intern-home/intern-home.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ForgetpasswordComponent } from './Components/login/forgetpassword/forgetpassword.component';
import { TaskShowComponent } from './Components/Pages/attendance/attendance-history/task-show/task-show.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { HolidaymanagementComponent } from './Components/Pages/hr/holidaymanagement/holidaymanagement.component';
import { HolidayComponent } from './Components/Pages/hr/holidaymanagement/holiday/holiday.component';
import { RegularizationComponent } from './Components/Pages/hr/regularization/regularization.component';
import { MentorRegularizationComponent } from './Components/Pages/mentor-home/mentor-regularization/mentor-regularization.component';
import { HolidayAddComponent } from './Components/Pages/hr/holidaymanagement/holiday-add/holiday-add.component';
import { HolidayProfileComponent } from './Components/Pages/hr/holidaymanagement/holiday-profile/holiday-profile.component';
import { ProjectManagementComponent } from './Components/Pages/hr/project-management/project-management.component';
import { ProjectProfileComponent } from './Components/Pages/hr/project-management/project-profile/project-profile.component';
import { ProjectAddComponent } from './Components/Pages/hr/project-management/project-add/project-add.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ServiceWorkerModule } from '@angular/service-worker';
import { appInitializer } from './_helpers/app.initializer';
import { AuthService } from './Shared/services/auth.service';


// a plugin
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoadingSpinnerComponent,
    ProfileComponent,
    BaseComponent,
    AttendanceComponent,
    MentorComponent,
    AdminComponent,
    HrComponent,
    AttendanceHistoryComponent,
    ApproveinternComponent,
    ApproveinternhistoryComponent,
    UserManagementComponent,
    UserListComponent,
    UserAddComponent,
    UserProfileComponent,
    UserAttendanceComponent,
    MentorHomeComponent,
    InternListComponent,
    InternAttendanceComponent,
    InternProfileComponent,
    ChangePasswordComponent,
    InternHomeComponent,
    ForgetpasswordComponent,
    TaskShowComponent,
    HolidaymanagementComponent,
    HolidayComponent,
    RegularizationComponent,
    MentorRegularizationComponent,
    HolidayAddComponent,
    HolidayProfileComponent,
    ProjectManagementComponent,
    ProjectProfileComponent,
    ProjectAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxTimerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDatepickerModule,
    FullCalendarModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatChipsModule,
    MsalModule.forRoot({
      auth: {
        clientId: environment.CLIENT_ID, // This is your client ID
        authority: environment.AUTHORITY, // This is your tenant ID
        redirectUri: environment.REDIRECT_URI,// This is your redirect URI
        postLogoutRedirectUri: environment.POST_LOGOUT_REDIRECT_URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
    }, {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true, deps: [AuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
