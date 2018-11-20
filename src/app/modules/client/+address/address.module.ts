import { NgModule } from '@angular/core';
import { AddressComponent } from './address.component';
import { FormsModule } from '@angular/forms';
//import { UtilsModule } from "../shared/utils/utils.module";
//import { SmartadminModule } from "../shared/smartadmin.module";
//import { SmartadminValidationModule } from "../shared/forms/validation/smartadmin-validation.module";
//import { SmartadminInputModule } from "../shared/forms/input/smartadmin-input.module";

@NgModule({
  imports: [
    FormsModule,
   // UtilsModule,
    //SmartadminModule,
    //SmartadminValidationModule,
    //SmartadminInputModule
  ],
  declarations: [
    AddressComponent
  ],
  exports: [
    AddressComponent
  ]
})
export class AddressModule {
}
