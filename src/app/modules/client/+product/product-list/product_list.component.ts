import { Component, OnInit } from '@angular/core';

// other imports here...

import { config } from '../../../../shared/constant';
import { HttpApiService } from '../../../../shared/http-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './product_list.html',
   styleUrls: ['./product_list.css'],
   providers: [HttpApiService]
})
export class ProductListComponent implements OnInit { 
  ;
  private data: string = "";
  public apiResponsesLoderFlag = [];
  private productListObj: any = [];
  private elements: any = {};
  public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  public rowSelected: number;

  // Initialized to specific date (09.10.2018)
  //dtOptions: DataTables.Settings = {};
  constructor(public httpApiService: HttpApiService, private router: Router) {
    this.elements["productlist"] = [];
  }

  ngOnInit() {
    this.data = "working";
    this.elements["productlist"] = [];
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
    this.getProductList();
  }
  

  getProductList() {    
    this.elements["companyid"] = 1;
    this.productListObj = [];
    let url = 'product/GetProductAllList';
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(url).then(res => {
      ;
      this.productListObj = res;
      this.apiResponsesLoderFlag.pop();
    },
      err => {
        this.apiResponsesLoderFlag.pop();
      });
  }
  oninvoicechange() {    
    localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
    this.router.navigate(['/invoice/invoice-creation']);
  } 
}
