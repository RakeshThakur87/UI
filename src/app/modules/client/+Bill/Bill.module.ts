// Angular

// Components Routing
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BillRoutingModule } from './Bill.route';
import { ProductOrderBillCreationComponent } from './+productorder-bill/pobill-add/pobill.component';
import { ProductOrderBillDetailComponent } from './+productorder-bill/pobill-list/pobill-list.component';
import { MiscellaneousBillDetailComponent } from './+miscellaneous-bill/miscellaneousbill-list/miscellaneousbill-list.component';
import { MiscellaneousBillCreationComponent } from './+miscellaneous-bill/miscellaneousbill-add/miscellaneousbill.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BillRoutingModule
  ],
  declarations: [
    MiscellaneousBillDetailComponent,
    MiscellaneousBillCreationComponent,
    ProductOrderBillDetailComponent,
    ProductOrderBillCreationComponent
  ]
})
export class BillModule { }
