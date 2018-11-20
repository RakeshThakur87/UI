import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { ThemeModule } from '../../core/theme.module';
import { SharedModule } from '../../shared/module/shared.module';
import { ClientAuthGuard } from '../../core/guards/client-auth.guard';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    ThemeModule,
    SharedModule,
    AngularMultiSelectModule
  ],
  declarations: [ClientRoutingModule.components],
  providers: [ClientAuthGuard]
})
export class ClientModule { }
