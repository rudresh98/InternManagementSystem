import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';

@Component({
  selector: 'app-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.scss'],
})
export class ProjectProfileComponent implements OnInit {
  isLoading: boolean = false;
  ProjectEmailValidation:string="valid";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.getIntials();
    this.getProjectDetail(this.ProjectID);
    this.declareForm();
  }

  ProjectProfile!: FormGroup;
  ProjectDetails: any;
  ProjectID: any;
  formDisabled: boolean = true;

  declareForm () {
    this.ProjectProfile = this.fb.group({
      ProjectName: [{ value: this.ProjectDetails.ProjectName, disabled: this.formDisabled }, [Validators.required]],
      ProjectMentor: [{ value: this.ProjectDetails.ProjectMentor, disabled: this.formDisabled }, [Validators.required]],
      ProjectDescription: [{ value: this.ProjectDetails.ProjectDescription, disabled: this.formDisabled }, [Validators.required]]
    });
  }

  getIntials() {
    this.ProjectDetails = {
      "ProjectName": "",
      "ProjectMentor": "",
      "ProjectDescription": "",
    }
  }

  getProjectDetail(projectId: string) {
    this.isLoading = true;
    this.commonservice.getProjectDetails(projectId).subscribe((res) => {
      if (res.status === 200) {
        console.log(res)
        this.getIntials();
        let projectInfo = res.body.Data
        this.ProjectDetails.ProjectName = projectInfo.ProjectName;
        this.ProjectDetails.ProjectMentor = projectInfo.ProjectMentor;
        this.ProjectDetails.ProjectDescription = projectInfo.ProjectDescription;
        console.log(this.ProjectDetails)
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      }
      this.isLoading = false;

    }, (error) => {
      this.getIntials();
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
    })
  }

  enableEdit () {
    this.formDisabled = false;
    this.declareForm();
  }

  changeProjectDetails () {
    this.isLoading = true;
    let payload = {
      ProjectName: this.ProjectProfile.value.ProjectName,
      ProjectMentor: this.ProjectProfile.value.ProjectMentor,
      ProjectDescription: this.ProjectProfile.value.ProjectDescription,
    }
    this.commonservice.updateProjectDetails(payload, this.ProjectID).subscribe((res) => {
      if (res.status === 200) {
        console.log(res);
        this.getProjectDetail(this.ProjectID);
        this.formDisabled = true;
        this.declareForm();
        this.eventEmitterService.onProjectManagementUpdate();
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      }
      this.isLoading = false;
    }, (error) => {
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
    });
  }

  deleteUser () {
    this.isLoading = true;
    this.commonservice.deleteProject(this.ProjectID).subscribe((res) => {
      if (res.status === 200) {
        console.log(res);
        this.eventEmitterService.onProjectManagementUpdate();
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
      }
      this.isLoading = false;
    }, (error) => {
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
