import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceApprovedComponent } from './invoice-approved/invoice-approved.component';
import { InvoicePendingComponent } from './invoice-pending/invoice-pending.component';
import { InvoiceReceivedComponent } from './invoice-received/invoice-received.component';
import { InvoiceReturnComponent } from './invoice-return/invoice-return.component';
import { InvoiceForwardComponent } from './invoice-forward/invoice-forward.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Invoice '
    },
    children: [
      {
        path: 'invoice-creation',
        component: InvoiceComponent,
        data: {
          title: 'invoice-ceation'
        }
      },
      {
        path: 'invoice-detail',
        component: InvoiceDetailComponent,
        data: {
          title: 'invoice-Detail'
        }
      },
      {
        path: 'invoice-approved',
        component: InvoiceApprovedComponent,
        data: {
          title: 'invoice-approved'
        }
      },
      {
        path: 'invoice-pending',
        component: InvoicePendingComponent,
        data: {
          title: 'invoice-pending'
        }
      },
      {
        path: 'invoice-received',
        component: InvoiceReceivedComponent,
        data: {
          title: 'invoice-received'
        }
      },
      {
        path: 'invoice-return',
        component: InvoiceReturnComponent,
        data: {
          title: 'invoice-return'
        }
      },
      {
        path: 'invoice-forward',
        component: InvoiceForwardComponent,
        data: {
          title: 'invoice-forward'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
