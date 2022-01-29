import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getinterncards() {
    throw new Error('Method not implemented.');
  }
  private API_ENDPOINT = environment.API_URL;

  constructor(private httpClient: HttpClient) {}

  getProfileData() {
    let userid = JSON.parse(localStorage.currentUser).UserID;
    let params = new HttpParams();
    params = params.append('UserID', userid);

    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'UserManagement/api/UserDetails/me',
      { headers: headersOptions, observe: 'response' }
    );
  }

  getAttedanceStatus() {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    // let params = new HttpParams();
    // params = params.append('UserID', userid);

    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/CurrentStatus/me',
      { headers: headersOptions, observe: 'response' }
    );
  }

  updateAttendanceStatus(payload: any) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.put<any>(
      this.API_ENDPOINT + 'UserManagement/api/UserDetails',
      payload,
      { headers: headersOptions }
    );
  }

  getAttedanceHistory() {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    let params = new HttpParams();
    let PageNumber: string = '1';
    // params = params.append('UserID', userid);
    params = params.append('PageNumber', PageNumber);
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/AttendanceReport/me',
      {
        params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  checkinLog() {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    // let params = new HttpParams();
    // params = params.append('UserID', userid);
    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'Attendance/api/AttendanceRegistration/me',
      {},
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  checkoutLog() {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    // let params = new HttpParams();
    // params = params.append('UserID', userid);

    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'Attendance/api/AttendanceClosure/me',
      {},
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  oninternhistory() {
    // let email = JSON.parse(localStorage.currentUser).EmailAddress;
    // let params = new HttpParams();
    // params = params.append('UserId', email);
    // console.warn(email);

    return this.httpClient.get<any>(
      this.API_ENDPOINT +
        'Attendance/api/AttendanceApprovalStatus',
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getinternstatus(Date: string, UserId: string, decision: string) {
    let email = JSON.parse(localStorage.currentUser).EmailAddress;

    let params = new HttpParams();
    params = params.append('Mentor', email);

    params = params.append('UserID', UserId);
    params = params.append('CreatedOn', Date);

    // console.warn(userid)
    // console.warn("vaavavavav",UserId,Date,decision);

    return this.httpClient.post<any>(
      this.API_ENDPOINT +
        'Attendance/api/AttendanceMentorApproval?Mentor=' +
        email +
        '&UserID=' +
        UserId +
        '&CreatedOn=' +
        Date +
        '&ApprovalStatus=' +
        decision,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  putinternregulization(Date: string, UserId: string, decision: string) {
    let email = JSON.parse(localStorage.currentUser).EmailAddress;

    let params = new HttpParams();
    params = params.append('Mentor', email);

    return this.httpClient.post<any>(
      this.API_ENDPOINT +
        '/Attendance/api/AttendanceRegularizationApproval?UserID=' +
        UserId +
        '&Mentor=' +
        email +
        '&ApprovalStatus=' +
        decision +
        '&CreatedOn=' +
        Date,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  userRegistration(payload: any) {
    let userid = JSON.parse(localStorage.currentUser).Mentor;
    let params = new HttpParams();
    params = params.append('UserId', userid);

    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'UserManagement/api/UserDetails',
      payload,
      {
        params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getUserList() {
    let userid = JSON.parse(localStorage.currentUser).UserID;
    let params = new HttpParams();
    params = params.append('UserID', userid);
    // params = params.append('PageNumber', "1");
    // params = params.append('Size', "10");

    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'UserManagement/api/FetchAllUsersByHR',
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
        params: params,
      }
    );
  }

  getUserDetails(userid: string) {
    let params = new HttpParams();
    params = params.append('UserID', userid);

    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'UserManagement/api/UserDetails',
      { params: params, headers: headersOptions, observe: 'response' }
    );
  }

  updateUserDetails(payload: any) {
    let userid = JSON.parse(localStorage.currentUser).UserID;
    let params = new HttpParams();
    params = params.append('UserID', userid);
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.put<any>(
      this.API_ENDPOINT + 'UserManagement/api/UserDetails',
      payload,
      {
        params: params,
        headers: headersOptions,
        observe: 'response',
      }
    );
  }

  getUserAttedanceHistory(userid: any) {
    let params = new HttpParams();
    let PageNumber: string = '1';
    params = params.append('UserID', userid);
    params = params.append('PageNumber', PageNumber);
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/AttendanceReport',
      {
        params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  deleteUser(userid: any) {
    let params = new HttpParams();
    params = params.append('UserID', userid);

    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.delete<any>(
      this.API_ENDPOINT + 'UserManagement/api/UserDetails',
      { params: params, headers: headersOptions, observe: 'response' }
    );
  }

  getInternList() {
    // let userid = JSON.parse(localStorage.currentUser).EmailAddress;
    // let params = new HttpParams();
    // params = params.append('Mentor', userid);

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'UserManagement/api/InternsUnderMentor',
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  changePassword(payload: any) {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'UserManagement/api/ChangePass',
      payload,
      {
        headers: headersOptions,
        observe: 'response',
      }
    );
  }

  // getTotalAttendance() {
  //   // let userid = JSON.parse(localStorage.currentUser).UserID;
  //   // let params = new HttpParams();
  //   // params = params.append('UserID', userid);

  //   return this.httpClient.get<any>(
  //     this.API_ENDPOINT + 'Attendance/api/AttendanceReportTotal/me',
  //     {
  //       headers: new HttpHeaders({
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       }),
  //       observe: 'response',
  //     }
  //   );
  // }

  // forget pasword

  forgetPassword(email: string) {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'UserManagement/api/ChangePassword',
      {
        EmailAddress: email,
      },
      {
        headers: headersOptions,
        observe: 'response',
      }
    );
  }

  taskUpdate(task: string) {
    let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'Attendance/api/TaskUpdate/me',
      {
        TaskUpdate: task,
      },
      {
        headers: headersOptions,
        observe: 'response',
      }
    );
  }

  getattendancecards() {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    // let params = new HttpParams();
    // params = params.append('UserID', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/AttendanceReportTotal/me',
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getcalendarevents(month: any, fullyear: any) {
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    // let params = new HttpParams();
    // params = params.append('UserID', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT +
        'Attendance/api/AttendanceCalendar/me?' +
        `&Month=${month}` +
        `&Year=${fullyear}`,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getholidaylistapi() {
    let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('UserID', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/HolidayList',
      {
        params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  HolidayRegistration(payload: any) {
    let userid = JSON.parse(localStorage.currentUser);
    let headersOptions: HttpHeaders = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('UserId', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    console.log(payload);
    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'Attendance/api/HolidayList',
      payload,
      {
        params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }
  updateHoliday(payload: any, date: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.put<any>(
      this.API_ENDPOINT + 'Attendance/api/Holiday/' + `${date}`,
      payload,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }
  getsingleholidayapi(holidaydate: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/Holiday/' + `${holidaydate}`,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getRegularizationHrSide() {
    let userid = JSON.parse(localStorage.currentUser);
    let headersOptions: HttpHeaders = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('UserId', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/Regularization',
      {
        // params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getRegularizationMentorSide() {
    // let userid = JSON.parse(localStorage.currentUser).EmailAddress;
    let headersOptions: HttpHeaders = new HttpHeaders();
    // let params = new HttpParams();
    // params = params.append('Mentor', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Attendance/api/Regularization',
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getregularizationstatus(Date: string, UserId: string, decision: string) {
    // let decision: string = status ? 'Approved' : 'Disapproved';
    let email = JSON.parse(localStorage.currentUser).EmailAddress;
    let params = new HttpParams();
    params = params.append('Mentor', email);
    params = params.append('UserID', UserId);
    params = params.append('CreatedOn', Date);
    return this.httpClient.post<any>(
      this.API_ENDPOINT +
        'Attendance/api/AttendanceMentorApproval?Mentor=' +
        email +
        '&UserID=' +
        UserId +
        '&CreatedOn=' +
        Date +
        '&ApprovalStatus=' +
        decision,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  getproject() {
    let email = JSON.parse(localStorage.currentUser).EmailAddress;
    let params = new HttpParams();
    params = params.append('Mentor', email);
    // params = params.append('UserID', UserId);
    // params = params.append('CreatedOn', Date);

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Project/api/ProjectList',
      {
        params: params,
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }
  projectRegistration(payload: any) {
    let userid = JSON.parse(localStorage.currentUser).EmailAddress;
    let headersOptions: HttpHeaders = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('UserId', userid);
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    console.log(payload);
    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'Project/api/ProjectList',
      payload,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  getProjectDetails(projectid: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Project/api/Project/' + `${projectid}`,
      { headers: headersOptions, observe: 'response' }
    );
  }

  getProjectList() {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'Project/api/ProjectList',
      {
        headers: headersOptions,
        observe: 'response',
      }
    );
  }

  updateProjectDetails(payload: any, projectid: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.put<any>(
      this.API_ENDPOINT + '/Project/api/Project/' + `${projectid}`,
      payload,
      {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      }
    );
  }

  deleteProject(projectid: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    return this.httpClient.delete<any>(
      this.API_ENDPOINT + 'Project/api/Project/' + `${projectid}`,
      { headers: headersOptions, observe: 'response' }
    );
  }

  deleteholiday(date: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.delete<any>(
      this.API_ENDPOINT + 'Attendance/api/Holiday/' + `${date}`,
      { headers: headersOptions, observe: 'response' }
    );
  }

  verifyADUser(email: string) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('Email', email);

    return this.httpClient.get<any>(
      this.API_ENDPOINT + 'UserManagement/api/VerifyADUsers',
      {
        headers: headersOptions,
        params: params,
        observe: 'response',
      }
    );
  }

  checkoutUser(task: string){
    // let userid = JSON.parse(localStorage.currentUser).UserID;
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json');
    return this.httpClient.post<any>(
      this.API_ENDPOINT + 'Attendance/api/Checkout',
      {
        TaskUpdate: task,
      },
      {
        headers: headersOptions,
        observe: 'response',
      }
    );
  }
}
