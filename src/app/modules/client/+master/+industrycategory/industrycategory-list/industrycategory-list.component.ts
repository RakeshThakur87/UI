import { Component, OnInit } from '@angular/core';
import { IndustryService } from '../../../../../core/services/industry.service';
import { Router } from '@angular/router';
// other imports here...
// import { saveAs } from 'file-saver/FileSaver.js'
import Swal from 'sweetalert2'
import { config } from '../../../../../shared/constant';
import { PagerService } from '../../../../../shared/pager-service';

@Component({
  selector: 'industrycategory-list',
  templateUrl: './industrycategory-list.html',
  styleUrls: ['./industrycategory-list.css'],
  providers: [IndustryService,PagerService]
})
export class IndustryCatListComponent implements OnInit {
  ;
  public apiResponsesLoderFlag = [];
  private itemListObj: any = [];
  private elements: any = {};
  public rowSelected: number;
  public ModeOfInvoiceSendList: any = [];
  display='none';
  //paging detail
  public total_record: any;
  pager: any = {};
  pag: any = {}
  prvflag: boolean = false;
  nextflag: boolean = false;
  public pageSize = 25;
  public pageNumber = 1;
  public static totalRecords = 0;
  public static totalRecordsAvailable = 0;  
  public pagerLength = 0;
  public pager_info: any;

  // Initialized to specific date (09.10.2018)
  model: any = { date: { year: 2018, month: 10, day: 9 } };
  // dtOptions: DataTables.Settings = {};

  constructor(public stacticService: IndustryService, private router: Router,public pagerService: PagerService) {
    this.pager['currentPage'] = 1;
    this.pager['totalPages'] = 0;
  }
      
  ngOnInit() {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
    this.getListData(1);
   // this.poListObj=[{"BranchName":'abc',"JobOrderNo":1,"PONo":2,"PODate":3,"GrandTotal":3000,"BilledAmount":4000}]
  }
  
  setPage(page: number) {
    this.pager['currentPage'] = page;
    this.elements['pageNo'] = page;
    this.getListData(this.elements['pageNo']);
  }

  getListData(currentPageNo) { 
    debugger;
    if (currentPageNo == 1) {
      this.pager.currentPage = 1;
    }
    if (currentPageNo) {
      this.pager['currentPage'] = currentPageNo;
      this.pageNumber = currentPageNo;
    }
    this.pager.currentPage = this.pageNumber;
    this.elements['pageNo'] = this.pageNumber;
    this.elements['pageSize'] = this.pageSize;
    this.apiResponsesLoderFlag.push(true);
    this.stacticService.GetIndustryCategoryList(this.elements).subscribe(res => {
      this.itemListObj = res.Result.Items;
      this.total_record = this.itemListObj.length;
      this.pagerLength = this.itemListObj.length;      
      this.pager['totalPages'] = res.Result.TotalPages;
      this.pag = this.pagerService.getPager(this.total_record , this.pager['currentPage'], this.pageSize);
      if (parseInt(this.pager.currentPage) == 1) {
        if (parseInt(this.pager.currentPage) == this.pager.totalPages) {
          this.prvflag = true;
          this.nextflag = true;
        } else {
          this.nextflag = false;
          this.prvflag = true;
        }
      }
      else if (parseInt(this.pager.currentPage) == this.pager.totalPages) {
        this.nextflag = true;
        this.prvflag = false;
      } else {
        this.nextflag = false;
        this.prvflag = false;
      }

      let pageFirstentryno = this.pageNumber > 0 ? ((this.pageNumber - 1) * this.pageSize) + 1 : 1;
      let pageLastentryno = this.total_record > this.pageSize ? this.pageNumber * this.pageSize : this.total_record;
      pageLastentryno = pageLastentryno > this.total_record ? this.total_record : pageLastentryno;
      if (this.total_record == 0) {
        pageFirstentryno = 0;
        pageLastentryno = 0;
      }
      this.pager_info = "Showing " + pageFirstentryno + " - " + pageLastentryno + " of " + this.total_record + " items";
      this.apiResponsesLoderFlag.pop();
    },
      err => {
        this.apiResponsesLoderFlag.pop();
      });
  }
  
  onAddNewItem() {    
    localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
    this.router.navigate(['/invoice/invoice-creation']);
  }  
}
