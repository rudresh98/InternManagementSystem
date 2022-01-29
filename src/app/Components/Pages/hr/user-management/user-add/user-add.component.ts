import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  FormGroupName,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface User {
  UserId: string;
  Name: string;
  CurrentProject: string;
  Mentor: string;
  Status: boolean;
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UserAddComponent implements OnInit {
  isLoading: boolean = false;
  isCheckInLoading!: boolean;
  loginForm: any;
  returnUrl!: string;
  showpass: string = '';
  projects: any;

  mentorEmailValidation: string = 'unchecked';
  orgEmailValidation: string = 'valid';
  projMentorEmailValidation: string[] = [];

  hide = true;
  userprofile!: FormGroup;
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  filterProjects!: any[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<UserAddComponent>
  ) {}

  ngOnInit(): void {
    this.declareform();
    this.getProjects();
  }

  userRegistration() {
    let payload = {
      Role: this.userprofile.value.role,
      Password: this.showpass + '@123',
      FirstName: this.userprofile.value.firstname,
      MiddleName: this.userprofile.value.middlename,
      LastName: this.userprofile.value.lastname,
      ContactNo: this.userprofile.value.contactno,
      EmailAddress: this.userprofile.value.emailAddress,
      OrganizationEmailAddress: this.userprofile.value
        .organizationalEmailAddress,
      DateOfJoining: this.userprofile.value.dateOfJoining,
      Mentor: this.userprofile.value.mentor,
      Projects: this.userprofile.get('projects')?.value,
    };

    let projects = [];
    for (let project of this.userprofile.get('projects')?.value) {
      projects.push({
        ProjectID: project.currentProject.ProjectID,
        ReportingManager: project.projectMentor,
      });
    }

    payload['Projects'] = projects;

    this.commonservice.userRegistration(payload).subscribe(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          this.dialogRef.close(res.body.Message);
          this.eventEmitterService.onUserDetailUpdate();
          //this.getUserList();
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

  declareform() {
    this.userprofile = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      middlename: new FormControl(''),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      contactno: new FormControl('', []),
      organizationalEmailAddress: new FormControl(''),
      dateOfJoining: new FormControl('', Validators.required),
      mentor: new FormControl('', Validators.required),
      role: new FormControl('Intern', Validators.required),
      password: new FormControl(this.showpass),
      projects: new FormArray([]),
    });
  }

  createItem() {
    var newItem = new FormGroup({
      currentProject: new FormControl('', Validators.required),
      projectMentor: new FormControl('', Validators.required),
    });
    newItem.get('currentProject')?.valueChanges.subscribe((data) => {
      // console.log("kdsfn >>>>>", data)
      this.filterProjects = this._filterGroup(data);
      console.log(this.filterProjects);
    });
    this.projMentorEmailValidation.push('unchecked');
    return newItem;
  }

  getProjects() {
    this.commonservice.getProjectList().subscribe(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          this.projects = res.body.Data;
          this.filterProjects = this._filterGroup('');
        } else if (res.status != 200) {
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
      }
    );
  }

  initialFilterList(event: any) {
    let word = event.target.value;
    this.filterProjects = this._filterGroup(word);
  }

  private _filterGroup(data: any) {
    if (typeof data == 'string') {
      const filterValue = data.toLowerCase();
      return this.projects.filter((option: any) => {
        // console.log("Option >>>>", option)
        return option.ProjectName.toLowerCase().indexOf(filterValue) === 0;
      });
    } else {
      return this.projects;
    }
  }

  addNext() {
    // console.log("ksldf");
    (this.userprofile.get('projects') as FormArray).push(this.createItem());
    // console.log(this.userprofile.get("projects"))
  }
  removeLink(i: number) {
    (this.userprofile.get('projects') as FormArray).removeAt(i);
    // this.projMentorEmailChecking.splice(i,1);
    this.projMentorEmailValidation.splice(i, 1);
  }

  getProjectControls() {
    return (this.userprofile.get('projects') as FormArray).controls;
  }

  getOptionText(option: any) {
    return option.ProjectName;
  }

  checkEmail(field: string, event: any, index: any = undefined) {
    if (field == 'mentorEmail') {
      this.mentorEmailValidation = 'checking';
    } else if (field == 'orgEmail') {
      this.orgEmailValidation = 'checking';
    } else if (field == 'projMentorEmail') {
      this.projMentorEmailValidation[index] = 'checking';
    }
    let email = event.target.value;
    this.commonservice.verifyADUser(email).subscribe((res) => {
      if (field == 'mentorEmail') {
        this.mentorEmailValidation = res.body.Data.isValid
          ? 'valid'
          : 'invalid';
      } else if (field == 'orgEmail') {
        this.orgEmailValidation = res.body.Data.isValid ? 'valid' : 'invalid';
      } else if (field == 'projMentorEmail') {
        this.projMentorEmailValidation[index] = res.body.Data.isValid
          ? 'valid'
          : 'invalid';
      }
    });
  }

  validateField() {
    let resultantProjMentorEmailValid = this.projMentorEmailValidation.every(
      (v) => v === 'valid'
    );
    let res =
      this.orgEmailValidation != 'valid' ||
      this.mentorEmailValidation != 'valid' ||
      !resultantProjMentorEmailValid;
    console.log(res);
    return res;
  }
}
