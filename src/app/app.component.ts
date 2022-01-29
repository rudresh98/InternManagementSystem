import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { AuthService } from './Shared/services/auth.service';
import { User } from './_models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'intern-management-system';
  
  currentUser!: User;

  constructor(private router: Router, private authService: AuthService, private authServiceAD: MsalService) {
    environment.production && (console.log = function () { })();
    this.authService.currentUser.subscribe((x) => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.authServiceAD.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
      console.log('Redirect Success: ', response?.accessToken);
    });
  }
}
