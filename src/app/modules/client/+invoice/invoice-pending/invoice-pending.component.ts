import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../../../../shared/http-api.service';
import { Router } from '@angular/router';
// other imports here...
//import { saveAs } from 'file-saver/FileSaver.js'
import Swal from 'sweetalert2'
import { config } from '../../../../shared/constant';
import { PagerService } from '../../../../shared/pager-service';

@Component({
  selector: 'app-invoice-pending',
  templateUrl: './invoice-pending.html',
  styleUrls: ['./invoice-pending.css'],
  providers: [HttpApiService,PagerService]
})
export class InvoicePendingComponent implements OnInit {
  ;
  public apiResponsesLoderFlag = [];
  private poListObj: any = [];
  private elements: any = {};
  private emailobj: any = {};
  public rowSelected: number;
  public ModeOfInvoiceSendList: any = [];
  emailmodel:any={};
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
  //dtOptions: DataTables.Settings = {};

  constructor(public httpApiService: HttpApiService, private router: Router,public pagerService: PagerService) {
    this.elements["invoiceidlist"] = [];
    this.ModeOfInvoiceSendList = [{ "Id": 1, "Name": "By Courier" }, { "Id": 2, "Name": "By Hand" }, { "Id": 3, "Name": "By Email" }];
    this.pager['currentPage'] = 1;
    this.pager['totalPages'] = 0;
    // this.elements['SearchString'] = "";
  }
      
  ngOnInit() {
    this.elements["invoiceidlist"] = [];
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
    this.getPoDetail(1);
   // this.poListObj=[{"BranchName":'abc',"JobOrderNo":1,"PONo":2,"PODate":3,"GrandTotal":3000,"BilledAmount":4000}]
  }
  
  setPage(page: number) {
    this.pager['currentPage'] = page;
    this.elements['pageNo'] = page;
    this.getPoDetail(this.elements['pageNo']);
  }

  getPoDetail(currentPageNo) { 
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
    // this.pageSize = this.elements['pageSize'];
    this.elements['pageSize'] = this.pageSize;
    this.elements["companyid"] = 2;
   // this.poListObj = [];
    let url = 'Invoice/GetStatusWiseInvoiceList';
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.post(url,this.elements).then(res => {
      debugger;
      this.poListObj = res.Result.Items;
     // this.ledgerList = result.ledgerDetail;
      this.total_record = this.poListObj.length;
      this.pagerLength = this.poListObj.length;      
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
  
  oninvoicechange() {
    
    localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
    this.router.navigate(['/invoice/invoice-creation']);
  }
  productChange(model, isselected) {
    let index = this.elements["productlist"].indexOf(model);
    if (index == -1) {
      this.elements["productlist"].push(model);
    } else {
      this.elements["productlist"].splice(index, 1);
    }  
  }

  rejectionChange(id)
  {
    debugger;
    let index = this.elements["productlist"].indexOf(id);
    if (index == -1) {
      this.elements["invoiceidlist"].push(id);
    } else {
      this.elements["invoiceidlist"].splice(index, 1);
    }  
  }

  applied(){
    if(this.elements["invoiceidlist"].length>0){
    this.display = "block";
    this.elements["remarks"]="";
    }
    else{
      Swal('Oops...', 'Please Select Atleast One Action!', 'error');
    }
}

submit(){

}
  printchange(selectedItem: any){
    debugger;
    this.elements["companyid"] = 2;
    this.apiResponsesLoderFlag.push(true);
   let fileName = "Invoice" + new Date().toLocaleDateString() + ".pdf";
      
    let url = 'Invoice/GetPrintInvoiceList/' + selectedItem.ID;
    
    this.httpApiService.getdownloadAsPdf(url).then(res => {
      debugger;
      //saveAs(res, fileName);
      this.apiResponsesLoderFlag.pop();
    },
      err => {
        this.apiResponsesLoderFlag.pop();
      });
  }
  public openCloseRow(idReserva: number): void {
    this.elements["productlist"] = [];
    if (this.rowSelected === -1) {
      this.rowSelected = idReserva
    }
    else {
      if (this.rowSelected == idReserva) {
        this.rowSelected = -1
      }
      else {
        this.rowSelected = idReserva
      }
    }
  }
onCloseHandled() {
    this.display = 'none';
}
}
