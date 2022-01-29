import { Routes } from '@angular/router';
import { LoginComponent } from 'src/app/Components/login/login.component';
import { AdminComponent } from 'src/app/Components/Pages/admin/admin.component';
import { ApproveinternComponent } from 'src/app/Components/Pages/approveintern/approveintern.component';
import { AttendanceComponent } from 'src/app/Components/Pages/attendance/attendance.component';
import { HomeComponent } from 'src/app/Components/Pages/home/home.component';
import { HolidayComponent } from 'src/app/Components/Pages/hr/holidaymanagement/holiday/holiday.component';
import { HolidaymanagementComponent } from 'src/app/Components/Pages/hr/holidaymanagement/holidaymanagement.component';
import { HrComponent } from 'src/app/Components/Pages/hr/hr.component';
import { ProjectAddComponent } from 'src/app/Components/Pages/hr/project-management/project-add/project-add.component';
import { ProjectManagementComponent } from 'src/app/Components/Pages/hr/project-management/project-management.component';
import { ProjectProfileComponent } from 'src/app/Components/Pages/hr/project-management/project-profile/project-profile.component';
import { RegularizationComponent } from 'src/app/Components/Pages/hr/regularization/regularization.component';
import { UserAttendanceComponent } from 'src/app/Components/Pages/hr/user-management/user-attendance/user-attendance.component';
import { UserManagementComponent } from 'src/app/Components/Pages/hr/user-management/user-management.component';
import { InternAttendanceComponent } from 'src/app/Components/Pages/mentor-home/intern-attendance/intern-attendance.component';
import { MentorRegularizationComponent } from 'src/app/Components/Pages/mentor-home/mentor-regularization/mentor-regularization.component';
import { MentorComponent } from 'src/app/Components/Pages/mentor/mentor.component';
import { ProfileComponent } from 'src/app/Components/Pages/profile/profile.component';

import { Role } from 'src/app/_models/role.model';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    // canActivate: [AuthGuard],
    data: { roles: [Role.User] },
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.User] },
  },
  {
    path: 'attendance/:userid',
    component: UserAttendanceComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.HR] },
  },
  {
    path: 'intern-attendance/:userid',
    component: InternAttendanceComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.Mentor] },
  },
  // {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [AuthGuard],
  //   data: { roles: [Role.HR] },
  // },
  {
    path: 'hr',
    component: HrComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.HR] },
  },
  {
    path: 'holiday',
    component: HolidayComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.HR] },
  },
  {
    path: 'mentor',
    component: MentorComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.Mentor] },
  },
  {
    path: 'RegularizationHR',

    component: RegularizationComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   roles: [Role.HR],
    // },
  },
  {
    path: 'RegularizationMentor',

    component: MentorRegularizationComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   roles: [Role.Mentor],
    // },
  },
  {
    path: 'ProjectManagment',

    component: ProjectManagementComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   roles: [Role.HR],
    // },
  },
  {
    path: 'ProjectAdd',

    component: ProjectAddComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   roles: [Role.HR],
    // },
  },
  {
    path: 'ProjectProfile',

    component: ProjectProfileComponent,
    // canActivate: [AuthGuard],
    // data: {
    //   roles: [Role.HR],
    // },
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'approveintern',
    component: ApproveinternComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.Mentor] },
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    // canActivate: [AuthGuard],
    // data: { roles: [Role.HR] },
  },

  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
