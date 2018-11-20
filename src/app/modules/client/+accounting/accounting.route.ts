import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountbookComponent } from './+accountbooks/accountbooks-list/accountbooks-list.component';
import { CostCategoryComponent } from './+chartofaccount/+cost-category/cost-category-list/cost-category-list.component';
import { CostCategoryCreateComponent } from './+chartofaccount/+cost-category/cost-category-add/cost-category.component';
import { LedgerComponent } from './+chartofaccount/+ledger/ledger-list/ledger-list.component';
import { LedgerCreationComponent } from './+chartofaccount/+ledger/ledger-add/ledger.component';
import { CostCenterComponent } from './+chartofaccount/+cost-center/cost-center-list/cost-center-list.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Accounting '
    },
    children: [
      {
        path: 'Accountbook',
        component: AccountbookComponent,
        data: {
          title: 'Industry List'
        }
      },
      {
        path: 'CostCategory',
        component: CostCategoryComponent,
        data: {
          title: 'Industry List'
        }
      },
      {
        path: 'CostCategoryAdd',
        component: CostCategoryCreateComponent,
        data: {
          title: 'Industry List'
        }
      },
      {
        path: 'Ledger',
        component: LedgerComponent,
        data: {
          title: 'Industry List'
        }
      },
      {
        path: 'CostCenter',
        component: CostCenterComponent,
        data: {
          title: 'Industry List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRouteModule {}
