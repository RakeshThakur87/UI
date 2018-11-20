// Components Routing
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from './project.routes';
import { ProjectCreationComponent } from './project-add/project.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProjectRoutingModule
  ],
  declarations: [
    ProjectListComponent,
    ProjectCreationComponent
  ]
})
export class ProjectModule { }
