import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../../../../shared/http-api.service';
import { Router } from '@angular/router';
// other imports here...
//import { saveAs } from 'file-saver/FileSaver.js'
import Swal from 'sweetalert2'
import { config } from '../../../../shared/constant';

@Component({
  selector: 'app-invoice-forward',
  templateUrl: './invoice-forward.html',
  styleUrls: ['./invoice-forward.css'],
  providers: [HttpApiService]
})
export class InvoiceForwardComponent implements OnInit {
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
    this.elements["invoiceidlist"] = [];
    this.ModeOfInvoiceSendList = [{ "Id": 1, "Name": "By Courier" }, { "Id": 2, "Name": "By Hand" }, { "Id": 3, "Name": "By Email" }];
    
  }
      
  ngOnInit() {
    this.elements["invoiceidlist"] = [];
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
