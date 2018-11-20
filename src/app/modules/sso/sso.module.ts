import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsoRoutingModule } from './sso-routing.module';
import { ThemeModule } from '../../core/theme.module';
import { SharedModule } from '../../shared/module/shared.module';
import { SsoAuthGuard } from '../../core/guards/sso-auth.guard';
debugger;
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
@NgModule({
  imports: [
    CommonModule,
    SsoRoutingModule,
    ThemeModule,
    SharedModule,
    AngularMultiSelectModule
  ],  
  declarations: [SsoRoutingModule.components],  
  providers: [SsoAuthGuard]
})

export class SsoModule { debugger;}