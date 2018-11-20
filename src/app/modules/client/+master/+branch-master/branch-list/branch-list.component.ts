import { Component, OnInit } from '@angular/core';

// other imports here...

import { config } from '../../../../../shared/constant';
import { HttpApiService } from '../../../../../shared/http-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-list.html',
   styleUrls: ['./branch-list.css'],
   providers: [HttpApiService]
})
export class BranchDetailComponent implements OnInit { 
  ;
  private data: string = "";
  public apiResponsesLoderFlag = [];
  private branchListObj: any = [];
  private elements: any = {};
  public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  public rowSelected: number;

  // Initialized to specific date (09.10.2018)
  // dtOptions: DataTables.Settings = {};
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
    this.getPoDetail();
  }
  

  getPoDetail() {    
    this.elements["companyid"] = 1;
    this.branchListObj = [];
    let url = 'business/GetCompanyWiseBranch/' + this.elements["companyid"];
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(url).then(res => {
      ;
      this.branchListObj = res;
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
