import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import * as moment from 'moment';

@Component({
  selector: 'app-intern-profile',
  templateUrl: './intern-profile.component.html',
  styleUrls: ['./intern-profile.component.scss'],
})
export class InternProfileComponent implements OnInit {
  public userId!: string;
  userprofile!: FormGroup;
  formDisabled: boolean = true;
  userDetail: any;
  isLoading: boolean = false;
  projects: any;
  filterProjects!: any[];
  projectRes: any;

  constructor(
    private commonservice: CommonService,
    private eventEmitterService: EventEmitterService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getProjects();
    this.getIntials();
    this.getUserDetail(this.userId);
    this.declareform();
  }

  getIntials() {
    this.userDetail = {
      userid: '',
      userstatus: '',
      role: '',
      dateofjoining: '',
      mentor: '',
      currentproject: '',
      projectmentor: '',
      firstname: '',
      middlename: '',
      lastname: '',
      contactno: '',
      emailaddress: '',
      organizationemailaddress: '',
    };
  }

  getUserDetail(userId: string) {
    this.isLoading = true;
    this.commonservice.getUserDetails(userId).subscribe(
      (res) => {
        if (res.status === 200) {
          console.log(res);
          this.getIntials();
          let userInfo = res.body.Data;
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
          this.userDetail.organizationemailaddress =
            userInfo.OrganizationEmailAddress;
          this.projectRes = userInfo.Projects

          this.updateProjectArray();
          console.log(this.userDetail);
        } else if (res.status != 200) {
          this.snackBar.open(res.body.Message, 'Close', { duration: 10000 });
        }
        this.isLoading = false;
      },
      (error) => {
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
      }
    );
  }

  updateProjectArray() {
    for (let project of this.projectRes) {
      // console.log(project)
      let item = this.createItem(project, project.ReportingManager);
      console.log(item);
      (this.userprofile.get("projects") as FormArray).push(item);
    }
  }

  // currentproject: [
  //   { value: this.userDetail.currentproject, disabled: this.formDisabled },
  //   [Validators.required],
  // ],
  // projectmentor: [
  //   { value: this.userDetail.projectmentor, disabled: this.formDisabled },
  //   [Validators.required],
  // ],

  declareform() {
    this.userprofile = this.fb.group({
      userid: [
        { value: this.userDetail.userid, disabled: this.formDisabled },
        [Validators.required],
      ],
      userstatus: [
        { value: this.userDetail.userstatus, disabled: this.formDisabled },
        [Validators.required],
      ],
      role: [
        { value: this.userDetail.role, disabled: this.formDisabled },
        [Validators.required],
      ],
      dateofjoining: [
        { value: this.userDetail.dateofjoining, disabled: this.formDisabled },
        [Validators.required],
      ],
      mentor: [
        { value: this.userDetail.mentor, disabled: this.formDisabled },
        [Validators.required],
      ],
      firstname: [
        { value: this.userDetail.firstname, disabled: this.formDisabled },
        [Validators.required],
      ],
      middlename: [
        { value: this.userDetail.middlename, disabled: this.formDisabled },
        [Validators.required],
      ],
      lastname: [
        { value: this.userDetail.lastname, disabled: this.formDisabled },
        [Validators.required],
      ],
      contactno: [
        { value: this.userDetail.contactno, disabled: this.formDisabled },
        [Validators.required],
      ],
      emailaddress: [
        { value: this.userDetail.emailaddress, disabled: this.formDisabled },
        [Validators.required],
      ],
      organizationemailaddress: [
        {
          value: this.userDetail.organizationemailaddress,
          disabled: this.formDisabled,
        },
        [Validators.required],
      ],
      projects: new FormArray([])
    });
  }

  getProjectControls() {
    return (this.userprofile.get('projects') as FormArray).controls;
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
}
