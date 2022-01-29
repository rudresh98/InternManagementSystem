import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import * as moment from 'moment';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  isLoading: boolean = false;
  public userId!: string;
  userprofile!: FormGroup;
  formDisabled: boolean = true;
  projects: any;
  userDetail: any;
  filterProjects!: any[];
  @Input() profile: any;
  projectRes: any;

  mentorEmailValidation : string = 'valid';
  orgEmailValidation : string = 'valid';
  projMentorEmailValidation : string[] = [];

  formErrors: any = {
    "userid": "",
    "userstatus": "",
    "role": "",
    "dateofjoining": "",
    "mentor": "",
    "currentproject": "",
    "projectmentor": "",
    "firstname": "",
    "middlename": "",
    "lastname": "",
    "contactno": "",
    "emailaddress": "",
    "organizationemailaddress": "",
  };

  validationMessages: any = {
    "userid": {
      'required': 'UserID is required.',
    },
    "userstatus": {
      'required': 'UserStatus is required.',
    },
    "role": {
      'required': 'Role is required.',
    },
    "dateofjoining": {
      'required': 'Date of Joining is required.',
    },
    "mentor": {
      'required': 'Mentor is required.',
    },
    "currentproject": {
      'required': 'Current Project is required.',
    },
    "projectmentor": {
      'required': 'Project Mentor is required.',
    },
    "firstname": {
      'required': 'Firstname is required.',
    },
    "middlename": {
      'required': 'Middle name is required.',
    },
    "lastname": {
      'required': 'Last name is required.',
    },
    "contactno": {
      'required': 'Contact no. is required.',
    },
    "emailaddress": {
      'required': 'Email is required.',
    },
    "organizationemailaddress": {
      'required': 'Email is required.',
    },
  };
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authServiceAD: MsalService,
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.getProjects();
    this.getIntials();
    this.getUserDetail(this.userId);
    this.declareform();

  }


  getIntials() {
    this.userDetail = {
      "userid": "",
      "userstatus": "",
      "role": "Intern",
      "dateofjoining": "",
      "mentor": "",
      "currentproject": "",
      "projectmentor": "",
      "firstname": "",
      "middlename": "",
      "lastname": "",
      "contactno": "",
      "emailaddress": "",
      "organizationemailaddress": ""
    }
  }

  getUserDetail(userId: string) {
    this.isLoading = true;
    this.commonservice.getUserDetails(userId).subscribe((res) => {
      if (res.status === 200) {
        console.log("user res", res)

        this.getIntials();
        let userInfo = res.body.Data
        console.log("moment",
          moment(userInfo.DateOfJoining).format('DD-MM-YYYY'))
        this.userDetail.userid = userInfo.UserID;
        this.userDetail.userstatus = userInfo.UserStatus;
        this.userDetail.role = userInfo.Role;
        this.userDetail.dateofjoining = moment(userInfo.DateOfJoining).format('YYYY-MM-DD');
        this.userDetail.mentor = userInfo.Mentor;
        this.userDetail.currentproject = userInfo.CurrentProject;
        this.userDetail.projectmentor = userInfo.ProjectMentor;
        this.userDetail.firstname = userInfo.FirstName;
        this.userDetail.middlename = userInfo.MiddleName;
        this.userDetail.lastname = userInfo.LastName;
        this.userDetail.contactno = userInfo.ContactNo;
        this.userDetail.emailaddress = userInfo.EmailAddress;
        this.userDetail.organizationemailaddress = userInfo.OrganizationEmailAddress;
        this.projectRes = userInfo.Projects

        this.updateProjectArray();
        // console.log(this.userDetail.projects)
        // console.log("user details",this.userDetail)
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

  updateProjectArray() {
    for (let project of this.projectRes) {
      // console.log(project)
      let item = this.createItem(project, project.ReportingManager);
      console.log(item);
      (this.userprofile.get("projects") as FormArray).push(item);
    }
  }

  enableEdit() {
    this.formDisabled = false;
    this.declareform();
    this.updateProjectArray();
  }

  changeUserDetails() {
    this.isLoading = true;
    let payload = {
      ContactNo: this.userprofile.value.contactno,
      CreatedDate: this.userprofile.value.createddate,
      CurrentProject: this.userprofile.value.currentproject,
      DateOfJoining: this.userprofile.value.dateofjoining,
      EmailAddress: this.userprofile.value.emailaddress,
      FirstName: this.userprofile.value.firstname,
      LastName: this.userprofile.value.lastname,
      Mentor: this.userprofile.value.mentor,
      MiddleName: this.userprofile.value.middlename,
      OrganizationEmailAddress: this.userprofile.value.organizationemailaddress,
      ProjectMentor: this.userprofile.value.projectmentor,
      Role: this.userprofile.value.role,
      UserID: this.userprofile.value.userid,
      UserStatus: this.userprofile.value.userstatus,
      Projects: this.userprofile.get('projects')?.value
    }

    let projects = [];
    for(let project of this.userprofile.get('projects')?.value){
      projects.push({
        ProjectID:project.currentProject.ProjectID,
        ReportingManager: project.projectMentor
      })
    }

    payload["Projects"] = projects

    this.commonservice.updateUserDetails(payload).subscribe((res) => {
      if (res.status === 200) {
        console.log(res);
        this.getUserDetail(this.userId);
        this.formDisabled = true;
        this.declareform();
        this.eventEmitterService.onUserDetailUpdate();
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
    })
  }

  // currentproject: [{ value: this.userDetail.currentproject, disabled: this.formDisabled }, [Validators.required]],
  //     projectmentor: [{ value: this.userDetail.projectmentor, disabled: this.formDisabled }, [Validators.required]],

  declareform() {
    this.userprofile = this.fb.group({
      userid: [{ value: this.userDetail.userid, disabled: this.formDisabled }, [Validators.required]],
      userstatus: [{ value: this.userDetail.userstatus, disabled: this.formDisabled }, [Validators.required]],
      role: [{ value: this.userDetail.role, disabled: this.formDisabled }, [Validators.required]],
      dateofjoining: [{ value: this.userDetail.dateofjoining, disabled: this.formDisabled }, [Validators.required]],
      mentor: [{ value: this.userDetail.mentor, disabled: this.formDisabled }, [Validators.required]],
      firstname: [{ value: this.userDetail.firstname, disabled: this.formDisabled }, [Validators.required]],
      middlename: [{ value: this.userDetail.middlename, disabled: this.formDisabled }, []],
      lastname: [{ value: this.userDetail.lastname, disabled: this.formDisabled }, [Validators.required]],
      contactno: [{ value: this.userDetail.contactno, disabled: this.formDisabled }, []],
      emailaddress: [{ value: this.userDetail.emailaddress, disabled: this.formDisabled }, [Validators.required]],
      organizationemailaddress: [{ value: this.userDetail.organizationemailaddress, disabled: this.formDisabled }, []],
      projects: new FormArray([])
    });
    this.userprofile.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userprofile) { return; }
    const form = this.userprofile;
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

  getProjectControls() {
    return (this.userprofile.get('projects') as FormArray).controls;
  }

  addNext() {
    console.log("ksldf");
    (this.userprofile.get("projects") as FormArray).push(this.createItem());
    console.log(this.userprofile.get("projects"))
  }
  removeLink(i: number) {
    (this.userprofile.get("projects") as FormArray).removeAt(i);
    this.projMentorEmailValidation.splice(i,1);
  }
  getOptionText(option: any) {
    return option.ProjectName;
  }
  private _filterGroup(data: any) {
    if (typeof data == "string") {
      const filterValue = data.toLowerCase();
      return this.projects.filter((option: any) => {
        console.log("Option >>>>", option)
        return option.ProjectName.toLowerCase().indexOf(filterValue) === 0;
      });
    } else {
      return this.projects;
    }
  }
  initialFilterList() {
    this.filterProjects = this._filterGroup('');
  }

  createItem(currentProjectValue = "", projectMentorValue = "") {
    console.log(currentProjectValue);
    console.log(projectMentorValue);
    var newItem = new FormGroup({
      currentProject: new FormControl({ value: currentProjectValue, disabled: this.formDisabled }, Validators.required),
      projectMentor: new FormControl({ value: projectMentorValue, disabled: this.formDisabled }, Validators.required),
    });

    console.log(newItem)
    newItem.get('currentProject')?.valueChanges.subscribe(data => {
      console.log("kdsfn >>>>>", data)
      this.filterProjects = this._filterGroup(data);
      console.log(this.filterProjects)
    });
    setTimeout(() => {
      newItem.patchValue({ currentProject: currentProjectValue });
    }, 0);
    this.projMentorEmailValidation.push('valid');
    return newItem;
  }

  getProjects() {
    this.commonservice.getProjectList().subscribe((res) => {
      if (res.status === 200) {
        console.log(res);
        this.projects = res.body.Data;
        this.filterProjects = this._filterGroup('');
      } else if (res.status != 200) {
        this.snackBar.open(res.body.Message, 'Close', { duration: 1500 });
      }
    }, (error) => {
      if (error === 'Unknown Error') {
        this.snackBar.open('Backend is not running , Please contact to admin', 'Close', { duration: 5000 });
      } else {
        this.snackBar.open(error, 'Close', { duration: 5000 });
      }
    })
  }

  checkEmail(field: string,event: any, index: any = undefined){
    if(field == 'mentorEmail'){
      this.mentorEmailValidation = 'checking';
    }else if(field == 'orgEmail'){
      this.orgEmailValidation = 'checking';
    }else if(field == 'projMentorEmail'){
      this.projMentorEmailValidation[index] = 'checking';
    }
    let email = (event.target.value);
    this.commonservice.verifyADUser(email).subscribe((res) => {
      if(field == 'mentorEmail'){
        this.mentorEmailValidation = res.body.Data.isValid?'valid':'invalid';
      }else if(field == 'orgEmail'){
        this.orgEmailValidation = res.body.Data.isValid?'valid':'invalid';
      }else if(field == 'projMentorEmail'){
        this.projMentorEmailValidation[index] = res.body.Data.isValid?'valid':'invalid';
      }
    });
  }

  validateField(){
    let resultantProjMentorEmailValid = this.projMentorEmailValidation.every(v => v === 'valid');
    let res = this.orgEmailValidation != 'valid' || this.mentorEmailValidation != 'valid' || !resultantProjMentorEmailValid
    console.log(res)
    return res
  }
}
