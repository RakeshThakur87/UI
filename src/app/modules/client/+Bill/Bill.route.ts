import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductOrderBillCreationComponent } from './+productorder-bill/pobill-add/pobill.component';
import { ProductOrderBillDetailComponent } from './+productorder-bill/pobill-list/pobill-list.component';
import { MiscellaneousBillDetailComponent } from './+miscellaneous-bill/miscellaneousbill-list/miscellaneousbill-list.component';
import { MiscellaneousBillCreationComponent } from './+miscellaneous-bill/miscellaneousbill-add/miscellaneousbill.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bill '
    },
    children: [
      {
        path: 'miscellaneous-bill',
        component: MiscellaneousBillDetailComponent,
        data: {
          title: 'Miscellaneous-Bill-Detail'
        }
      },
      {
        path: 'miscellaneous-bill-creation',
        component: MiscellaneousBillCreationComponent,
        data: {
          title: 'miscellaneous-bill-ceation'
        }
      },
      {
        path: 'po-bill',
        component: ProductOrderBillDetailComponent,
        data: {
          title: 'Product-Order-Bill-Detail'
        }
      },      
      {
        path: 'po-bill-creation',
        component: ProductOrderBillCreationComponent,
        data: {
          title: 'product-order-bill-ceation'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
