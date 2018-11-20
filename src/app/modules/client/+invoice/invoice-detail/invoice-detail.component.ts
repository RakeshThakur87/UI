import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../../../../shared/http-api.service';
import { Router } from '@angular/router';
// other imports here...
//import { saveAs } from 'file-saver/FileSaver';
import { config } from '../../../../shared/constant';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.html',
  styleUrls: ['./invoice-detail.css'],
  providers: [HttpApiService]
})
export class InvoiceDetailComponent implements OnInit {
  ;
  public apiResponsesLoderFlag = [];
  private poListObj: any = [];
  private elements: any = {};
  private emailobj: any = {};
  public rowSelected: number;
  public ModeOfInvoiceSendList: any = [];
  emailmodel:any={};
  display='none';

  // Initialized to specific date (09.10.2018)
  model: any = { date: { year: 2018, month: 10, day: 9 } };
  //dtOptions: DataTables.Settings = {};
  constructor(public httpApiService: HttpApiService, private router: Router) {
    this.elements["productlist"] = [];
    this.ModeOfInvoiceSendList = [{ "Id": 1, "Name": "By Courier" }, { "Id": 2, "Name": "By Hand" }, { "Id": 3, "Name": "By Email" }];
    
  }
      
  ngOnInit() {
    this.elements["productlist"] = [];
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
    this.getPoDetail();
   // this.poListObj=[{"BranchName":'abc',"JobOrderNo":1,"PONo":2,"PODate":3,"GrandTotal":3000,"BilledAmount":4000}]
  }
  

  getPoDetail() {    
    this.elements["companyid"] = 2;
   // this.poListObj = [];
    let url = 'Invoice/GetInvoiceList/' + this.elements["companyid"];
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(url).then(res => {
      ;
      this.poListObj = res;
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

  printchange(selectedItem: any){
    debugger;
    this.elements["companyid"] = 2;
    this.apiResponsesLoderFlag.push(true);
    let fileName = "Invoice" + new Date().toLocaleDateString() + ".pdf";       
    let url = 'Invoice/GetPrintInvoiceList/' + selectedItem.ID;    
    this.httpApiService.getdownloadAsPdf(url).then(res => {
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
 
  email() {
    this.display = "block";
    this.emailmodel["invoicetype"]="";
}
onCloseHandled() {
    this.display = 'none';
}

sendemail(){
  let url = 'Invoice/SendEmail' ;
  let bodyobj: any = {};
  debugger;
  bodyobj["ConsumerId"] = 2;
  bodyobj["AgencyId"] = 2;
  bodyobj["ContactPersonName"] = "";
  bodyobj["Invoicehandoverdate"] = ""
  bodyobj["Remarks"] = ""
  bodyobj["CourierNo"] = ""
  bodyobj["CourierCompanyName"] = ""
  bodyobj["OfficeTypeId"] = "1"
  bodyobj["CourierDate"] = ""
  bodyobj["CourierArivalDate"] = ""

  bodyobj["InvoiceNo"] = ""
  bodyobj["AgencyName"] = ""
  bodyobj["InvoiceDate"] = ""

  bodyobj["PONo"] = "8"
  bodyobj["PODate"] = ""
  bodyobj["AreaOfficeName"] = ""

  bodyobj["SiteName"] = ""
  bodyobj["Invoiceuuid"] = ""
  bodyobj["Invoiceid"] = "1"

  bodyobj["EmailId"] = "karun.kashyap@otis.com"
  bodyobj["AgencyEmailId"] = "bsms2010@rediffmail.com"

  this.apiResponsesLoderFlag.push(true);
        this.httpApiService.post(url, bodyobj).then(res => {
      debugger;
     this.onCloseHandled();
      this.apiResponsesLoderFlag.pop();
    },
      err => {
        this.onCloseHandled();
        this.apiResponsesLoderFlag.pop();
      });
}
}
