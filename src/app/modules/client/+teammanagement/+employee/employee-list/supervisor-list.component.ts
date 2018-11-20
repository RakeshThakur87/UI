import { Component, OnInit } from '@angular/core';

// other imports here...

import { config } from '../../../../../shared/constant';
import { HttpApiService } from '../../../../../shared/http-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  templateUrl: './supervisor-list.html',
   styleUrls: ['./supervisor-list.css'],
   providers: [HttpApiService]
})
export class SupervisorComponent implements OnInit { 
 
  private data: string = "";
  public apiResponsesLoderFlag = [];
  private projectListObj: any = [];
  private elements: any = {};
  public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  public rowSelected: number;

  // Initialized to specific date (09.10.2018)
  //dtOptions: DataTables.Settings = {};
  constructor(public httpApiService: HttpApiService, private router: Router) {
    this.elements["projectlist"] = [];
  }

  ngOnInit() {
    this.data = "working";
    this.elements["projectlist"] = [];
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
    this.getProjectDetail();
  }
  

  getProjectDetail() {    
    this.elements["companyid"] = 2;
    this.projectListObj = [];
    let url = 'Project/GetProjectCompanyBranchWise/' + this.elements["companyid"]+'/0';
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(url).then(res => {
      ;
      this.projectListObj = res;
      this.apiResponsesLoderFlag.pop();
    },
      err => {
        this.apiResponsesLoderFlag.pop();
      });
  }
  onprojectchange() {    
    localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
    this.router.navigate(['/invoice/invoice-creation']);
  } 
}
