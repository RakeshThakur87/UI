import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectCreationComponent } from './project-add/project.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Project '
    },
    children: [
      {
        path: 'project-detail',
        component: ProjectListComponent,
        data: {
          title: 'Project List'
        }
      },
      {
        path: 'ProjectAdd',
        component: ProjectCreationComponent,
        data: {
          title: 'Add New Project'
        }
      },
      {
        path: 'update-Project/:id',
        component: ProjectCreationComponent,
        data: {
          title: 'Update-Project',
          isProd: true
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
