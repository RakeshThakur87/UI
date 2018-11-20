// Components Routing
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ProductRoutingModule } from './product.routes';
import { ProductCreationComponent } from './product-add/product.component';
import { ProductListComponent } from './product-list/product_list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProductRoutingModule
  ],
  declarations: [
    ProductListComponent,
    ProductCreationComponent
  ]
})
export class ProductModule { }
