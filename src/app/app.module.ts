import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './core/theme.module';
import { TemplateCoreModule } from './core/template-core.module';
import { ToasterModule } from 'angular2-toaster';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NbToastrService } from '@nebular/theme';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    CoreModule,
    AngularMultiSelectModule,
    ThemeModule.forRoot(),
    TemplateCoreModule.forRoot(),
    ToasterModule.forRoot(),
    NgbModule.forRoot(),
   // NbToastrService
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
