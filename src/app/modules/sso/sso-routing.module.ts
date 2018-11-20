import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsoComponent } from './sso.component';
import { SsoAuthGuard } from '../../core/guards/sso-auth.guard';
import { SSOModuleCreationComponent } from './+module/module-add/module.component';
const sso_routes: Routes = [
  {
    path: '',
    component: SsoComponent,
    canActivate: [SsoAuthGuard],
    canActivateChild: [SsoAuthGuard],
    children: [
      {
        path: 'ssomodule',
        component: SSOModuleCreationComponent,
        data: { title: 'Sso' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(sso_routes)],
  exports: [RouterModule],
})
export class SsoRoutingModule {
  static components = [
    SSOModuleCreationComponent
  ];
}
