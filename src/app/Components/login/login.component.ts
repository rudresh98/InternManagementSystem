import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MsalService } from '@azure/msal-angular';
import { MatDialog } from '@angular/material/dialog';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error: any;
  isLoading: boolean = false;
  hide: boolean = true;
  returnUrl!: string;

  formErrors: any = {
    email: '',
    password: '',
  };

  validationMessages: any = {
    email: {
      required: 'Email is required.',
      email: 'Provide proper email',
    },
    password: {
      required: 'Password is required.',
    },
  };
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    public dialog: MatDialog
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.createForm();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.loginForm.valueChanges.subscribe((data: any) =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  login() {
    this.isLoading = true;
    let payload = {
      Email: this.loginForm.value['email'],
      Password: this.loginForm.value['password'],
    };
    this.authService
      .login(payload)
      .pipe(first())
      .subscribe(
        (res) => {
          if (res.status === 200) {
            this.router.navigate([this.returnUrl]);
            console.log('kfkjadf', res);
          }
          if (res.status != 200) {
            this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
          }
        },
        (error) => {
          if (error === 'Unknown Error') {
            this.snackBar.open(
              'Backend is not running , Please contact to admin',
              'Close',
              { duration: 5000 }
            );
          } else {
            this.snackBar.open(error, 'Close', { duration: 5000 });
          }
          this.isLoading = false;
        }
      );
  }

  async ssoAuth() {
    this.isLoading = true;
    await this.ssoLogin();
    const requestObj = {
      scopes: ['user.read'],
    };
    var token = await this.authServiceAD.acquireTokenPopup(requestObj);
    var payload = { Token: token.accessToken };
    this.authService.ssoLogin(payload).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.router.navigate([this.returnUrl]);
        }
        if (res.status != 200) {
          this.snackBar.open(res.Message, 'Close', { duration: 1500 });
        }
      },
      (error) => {
        if (error.statusText === 'Unknown Error') {
          this.snackBar.open(
            'Backend is not running , Please contact to admin',
            'Close',
            { duration: 5000 }
          );
        } else {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
        this.isLoading = false;
      }
    );
  }

  async ssoLogin() {
    const isIE =
      window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      var resp = await this.authServiceAD.loginRedirect({
        extraScopesToConsent: ['user.read', 'openid', 'profile'],
      });
    } else {
      var respo = await this.authServiceAD.loginPopup({
        extraScopesToConsent: ['user.read', 'openid', 'profile'],
      });
    }
  }

  // forget password

  openForgetPassword() {
    const dialogRef = this.dialog.open(ForgetpasswordComponent, {
      width: '500px',
    });
  }
}
