// Components Routing
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceRoutingModule } from './invoice.routing';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceApprovedComponent } from './invoice-approved/invoice-approved.component';
import { InvoicePendingComponent } from './invoice-pending/invoice-pending.component';
import { InvoiceReceivedComponent } from './invoice-received/invoice-received.component';
import { InvoiceReturnComponent } from './invoice-return/invoice-return.component';
import { InvoiceForwardComponent } from './invoice-forward/invoice-forward.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InvoiceRoutingModule
  ],
  declarations: [
    InvoiceComponent,
    InvoiceDetailComponent,
    InvoiceApprovedComponent,
    InvoicePendingComponent,
    InvoiceReceivedComponent,
    InvoiceReturnComponent,
    InvoiceForwardComponent
  ]
})
export class InvoiceModule { }
