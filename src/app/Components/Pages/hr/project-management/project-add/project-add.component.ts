import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Project } from '../../../../../_models/project.model';
@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss'],
})
export class ProjectAddComponent implements OnInit {
  isLoading: boolean = false;
  isCheckInLoading!: boolean;
  Projectprofile!: FormGroup;

  ProjectEmailValidation:string="unchecked";



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<ProjectAddComponent>
  ) {}

  ngOnInit(): void {
    this.decalareProject();
    if (this.eventEmitterService.ProjectDetailSub == undefined) {
      this.eventEmitterService.ProjectDetailSub = this.eventEmitterService.
      invokeGetProjectDetail.subscribe(() => {
          this.projectadd()
        });
    }
  }

  projectadd() {
    let payload = {
      ProjectName: this.Projectprofile.value.ProjectName,
      ProjectMentor: this.Projectprofile.value.ProjectMentor,
      ProjectDescription: this.Projectprofile.value.ProjectDescription,
    };
    let temparr = [payload];
    console.log('temparr', temparr);
    console.log(payload);
    this.dialogRef.close('closed');
    this.commonservice.projectRegistration(temparr).subscribe(
      (res) => {
        console.log('hlidayreg', res);
        if (res.status === 200 || res.status === 201) {
          this.dialogRef.close(res.body.Message);
          this.eventEmitterService.onProjectManagementUpdate();
          this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
        } else if (res.status != 200) {
          this.dialogRef.close(res.body.Message);
          this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
        }
        this.isCheckInLoading = false;
      },
      (error) => {
        if (error === 'Unknown Error') {
          this.dialogRef.close(error);
          this.snackBar.open(
            'Backend is not running , Please contact to admin',
            'Close',
            { duration: 5000 }
          );
        } else {
          this.dialogRef.close(error);
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
        this.isCheckInLoading = false;
      }
    );
  }
  decalareProject() {
    this.Projectprofile = new FormGroup({
      ProjectName: new FormControl('', Validators.required),
      ProjectMentor: new FormControl('', Validators.required),
      ProjectDescription: new FormControl('', Validators.required),
    });
  }


  
  checkEmail(event: any){
    this.ProjectEmailValidation="checking";
    let email = (event.target.value);
    this.commonservice.verifyADUser(email).subscribe((res) => {
      this.ProjectEmailValidation = res.body.Data.isValid?'valid':'invalid';
    });
  }
  
}
