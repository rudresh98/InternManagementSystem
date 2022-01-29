import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/Shared/services/common.service';
import { EventEmitterService } from 'src/app/_helpers/emitter/event-emitter.service';
import { Project } from '../../../../_models/project.model';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectProfileComponent } from './project-profile/project-profile.component';
@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss'],
})
export class ProjectManagementComponent implements OnInit {
  isLoading: boolean = false;

  displayColumns: string[] = [
    'ProjectName',
    'ProjectMentor',
    'ProjectDescription',
  ];
  datasource = new MatTableDataSource<Project>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private commonService: CommonService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit(): void {
    this.getproject();
    if (this.eventEmitterService.ProjectDetailSub == undefined) {
      this.eventEmitterService.ProjectDetailSub = this.eventEmitterService.invokeGetProjectDetail.subscribe(
        () => {
          this.getproject();
        }
      );
    }
  }
  getproject() {
    this.isLoading = true;
    this.commonService.getproject().subscribe(
      (res) => {
        console.log('res of project', res);
        if (res.status === 200) {
          let temparr: any = [];
          res.body.Data.map((ele: any) => {
            console.log(ele);
            const temp = {
              ProjectName: ele.ProjectName,
              ProjectMentor: ele.ProjectMentor,
              ProjectDescription: ele.ProjectDescription,
              ProjectID: ele.ProjectID
            };
            temparr.push(temp);
            console.log(temparr);
          });
          this.datasource = new MatTableDataSource<Project>(temparr);
          this.datasource.paginator = this.paginator;
        } else if (res.status != 200) {
          this.snackBar.open(res.body.Message, 'Close', { duration: 1000 });
        }
        this.isLoading = false;
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
  openProject(element: any) {
    console.log('openProjectlistedit clicked');
    const dialogRef = this.dialog.open(ProjectProfileComponent, {
      width: '500px',
    });
    dialogRef.componentInstance.ProjectID = element.ProjectID;
  }
  onAddProject() {
    const dialogRef = this.dialog.open(ProjectAddComponent);
  }
  DoFilter(event:any)
  {
    console.log(event)
    
    this.datasource.filter = event.target.value.trim().toLowerCase();

  }
}
