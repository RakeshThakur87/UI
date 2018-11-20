// Components Routing
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { AccountbookComponent } from './+accountbooks/accountbooks-list/accountbooks-list.component';
import { CostCategoryComponent } from './+chartofaccount/+cost-category/cost-category-list/cost-category-list.component';
import { CostCategoryCreateComponent } from './+chartofaccount/+cost-category/cost-category-add/cost-category.component';
import { LedgerComponent } from './+chartofaccount/+ledger/ledger-list/ledger-list.component';
import { LedgerCreationComponent } from './+chartofaccount/+ledger/ledger-add/ledger.component';
import { CostCenterComponent } from './+chartofaccount/+cost-center/cost-center-list/cost-center-list.component';
import { AccountingRouteModule } from './accounting.route';
//import { AngularMultiSelectModule } from 'angular4-multiselect-dropdown/angular4-multiselect-dropdown';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AccountingRouteModule,
    CostCategoryComponent,
    CostCategoryCreateComponent,
    LedgerComponent,
    LedgerCreationComponent,
    CostCenterComponent,
  ],
  declarations: [
    AccountbookComponent
  ]
})
export class AccountingModule {
  
 }
