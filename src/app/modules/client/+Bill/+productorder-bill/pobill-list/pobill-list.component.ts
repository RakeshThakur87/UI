import { Component, OnInit } from '@angular/core';
// other imports here...
import { config } from '../../../../../shared/constant';
import { Utility } from '../../../../../shared/utility';
import { HttpApiService } from '../../../../../shared/http-api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-productorder-Bill-detail',
  templateUrl: './pobill-list.html',
  styleUrls: ['./pobill-list.css'],
  providers: [HttpApiService, Utility]
})
export class ProductOrderBillDetailComponent implements OnInit {
  ;
  private data: string = ""; 
  private emailmodel:any={};
  public apiResponsesLoderFlag = [];
  private poListObj: any = [];
  private elements: any = {};
  public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

  public rowSelected: number;



  // Initialized to specific date (09.10.2018)
  model: any = { date: { year: 2018, month: 10, day: 9 } };
  //dtOptions: DataTables.Settings = {};
  constructor(public utility: Utility, public httpApiService: HttpApiService, private router: Router) {
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

    this.elements["companyid"] = 2;
    this.poListObj = [];
    let url = 'PoHeader/GetPOList/' + this.elements["companyid"];
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
    // Swal('Oops...', 'Something went wrong!', 'error');
    // let title = "Are you sure to create Invoice?'";
    // let url = "/invoice/invoice-creation'"
    // this.utility.SwalwarningPopUp(title, url);
    Swal({
      title: 'Are you sure to create Invoice?',
     // text: 'You will not be able to recover this imaginary file!',
      type: 'warning',//success
      showCancelButton: true,
      confirmButtonText: 'Yes',
      // cancelButtonText: 'No, keep it'
    }).then((result) => {
      debugger;
      if (result.value) {
        localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
        this.router.navigate(['/invoice/invoice-creation']);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          // 'Your imaginary file is safe :)',
          // 'error'
        )
      }
    })
  }
  productChange(model, isselected) {

    //  this.elements["productlist"] = [];

    let index = this.elements["productlist"].indexOf(model);
    if (index == -1) {
      this.elements["productlist"].push(model);
    } else {
      this.elements["productlist"].splice(index, 1);

    }   // for (let key in this.poListObj) {
    //   let productdetailobj = {};
    //   if (key == index) {
    //     ;

    //     for(let subkey in this.poListObj[key].PO_Detail_List)
    //     {
    //       if(this.poListObj[key].PO_Detail_List[subkey]==true)
    //       {
    //         productdetailobj["productdetail"] = this.poListObj[key].PO_Detail_List.find(x=>x.isselected==true);
    //         this.elements["productlist"].push(productdetailobj);
    //       }


    //     }


    //   }

    // }
    // }

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

}
