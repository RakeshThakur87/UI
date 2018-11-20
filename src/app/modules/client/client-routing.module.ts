import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client.component';
import { ClientAuthGuard } from '../../core/guards/client-auth.guard';
import { SignupComponent } from './signup/signup.component';
import { ApplicationDetailsComponent } from './+sso/+application/application-list/application-list.component';
//import { ModuleDetailsComponent } from './+sso/+module/module-list/module-list.component';
import { IndustryListComponent } from './+master/+industry/industry-list/industry-list.component';
import { IndustryCreationComponent } from './+master/+industry/industry-add/industry.component';
import { IndustryCatCreationComponent } from './+master/+industrycategory/industrycategory-add/industrycategory.component';
import { IndustryCatListComponent } from './+master/+industrycategory/industrycategory-list/industrycategory-list.component';
import { GroupCreationComponent } from './+product/group-add/group.component';
import { EmployeeCreationComponent } from './+teammanagement/+employee/employee-add/employee.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'application-detail',
        component: ApplicationDetailsComponent,
        data: { title: 'Client Dashboard' }
      },
      {
        path: 'industry',
        component: IndustryListComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  // {
  //   path: '',
  //   component: ClientComponent,
  //   canActivate: [ClientAuthGuard],
  //   canActivateChild: [ClientAuthGuard],
  //   children: [
  //     {
  //       path: 'industry',
  //       component: IndustryListComponent,
  //       data: { title: 'Client Dashboard' }
  //     },
  //   ],
  // },
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'industry-creation',
        component: IndustryCreationComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'industrycat-creation',
        component: IndustryCatCreationComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'employee-creation',
        component: EmployeeCreationComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'industrycat',
        component: IndustryCatListComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  {
    path: '',
    component: ClientComponent,
    canActivate: [ClientAuthGuard],
    canActivateChild: [ClientAuthGuard],
    children: [
      {
        path: 'group',
        component: GroupCreationComponent,
        data: { title: 'Client Dashboard' }
      },
    ],
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Client Signup' }
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {
  static components = [
    DashboardComponent,
    ApplicationDetailsComponent,
    IndustryListComponent,
    IndustryCreationComponent,
    IndustryCatCreationComponent,
    IndustryCatListComponent,
    GroupCreationComponent,
    EmployeeCreationComponent,
    ClientComponent,
    SignupComponent
  ];

}
