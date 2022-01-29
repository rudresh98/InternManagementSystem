import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { User } from 'src/app/_models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject!: BehaviorSubject<User>;
  public currentUser!: Observable<User>;
  private API_ENDPOINT = environment.API_URL;

  loggedIn!: boolean;
  constructor(private httpClient: HttpClient,private eventEmitterService: EventEmitterService) {
    const user_data: any = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user_data));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  login(payload: any) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json')
    return this.httpClient.post<any>(this.API_ENDPOINT + "UserAuthentication/api/AuthenticationLogin", payload,{ headers: headersOptions,observe:"response" }
    )
      .pipe(map(res => {
        if (res.status == 200) {
          let user = res.body.Data;
          user['LoginMethod'] = 'creds';
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return res;
        } else {
          return res;
        }
        console.warn(res)
      })
      );
  }

  ssoLogin(payload: any) {
    let headersOptions: HttpHeaders = new HttpHeaders();
    headersOptions = headersOptions.append('Accept', 'application/json');
    headersOptions = headersOptions.append('Content-Type', 'application/json')
    headersOptions = headersOptions.append('LoginToken', payload.Token)
    return this.httpClient.post<any>(this.API_ENDPOINT + "UserAuthentication/api/AuthenticationSSO", {}, { headers: headersOptions, observe: 'response'})
      .pipe(map(res => {
        if (res.status == 200) {
          let user = res.body.Data;
          user['LoginMethod'] = 'sso';
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return res;
        } else {
          return res;
        }
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    let nullUser : any = null;
    this.currentUserSubject.next(nullUser);
    this.eventEmitterService.attendanceHistorySub = undefined;
    this.eventEmitterService.userDetailSub = undefined;
    this.eventEmitterService.HolidayHistorySub=undefined;
    this.eventEmitterService.ProjectDetailSub=undefined;
  }

  refreshToken() {
    let currentUser = this.currentUserValue;
    let isLoggedIn = currentUser && currentUser.Token
    if(isLoggedIn){
      let loginMethod = currentUser.LoginMethod
      return this.httpClient.post<any>(this.API_ENDPOINT + 'UserAuthentication/api/Refresh', {}, { observe: 'response'})
      .pipe(map(res => {
        // console.log('asdf')
        if (res.status == 200) {
          // console.log('asdfasdf')
          let user = res.body.Data;
          user['LoginMethod'] = loginMethod;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return res;
        } else {
          return res;
        }
      }));
    }else{
      return of({})
    }
  }
}
