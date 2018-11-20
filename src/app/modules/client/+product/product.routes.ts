import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductCreationComponent } from './product-add/product.component';
import { ProductListComponent } from './product-list/product_list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Product '
    },
    children: [
      {
        path: 'product',
        component: ProductListComponent,
        data: {
          title: 'Product List'
        }
      },
      {
        path: 'product-creation',
        component: ProductCreationComponent,
        data: {
          title: 'Add New Product'
        }
      },
      {
        path: 'update-Product/:id',
        component: ProductCreationComponent,
        data: {
          title: 'Update-Product',
          isProd: true
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
