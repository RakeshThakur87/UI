import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../../../../../shared/http-api.service';
import { Router } from '@angular/router';
// other imports here...
import Swal from 'sweetalert2'
import { config } from '../../../../../shared/constant';
import { PagerService } from '../../../../../shared/pager-service';
import { StaticService } from '../../../../../core/services/static.service';
@Component({
  selector: 'application-detail',
  templateUrl: './application-list.html',
  styleUrls: ['./application-list.css'],
  providers: [HttpApiService, PagerService]
})
export class ApplicationDetailsComponent implements OnInit {
  ;
  public apiResponsesLoderFlag = [];
  private ListObj: any = [];
  private elements: any = {};
  public rowSelected: number;
  public ModeOfInvoiceSendList: any = [];
  emailmodel: any = {};
  display = 'none';
  //dtOptions: DataTables.Settings = {};

  constructor(private staticService: StaticService, private router: Router, public pagerService: PagerService) {
  }

  ngOnInit() {
    this.getlistDetail();
  }

  getlistDetail() {
    this.staticService.application()
      .subscribe((data: any) => {
        ;
        this.ListObj = data;
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
  ondelete() {
    // Swal('Oops...', 'Something went wrong!', 'error');
    // let title = "Are you sure to create Invoice?'";
    // let url = "/invoice/invoice-creation'"
    // this.utility.SwalwarningPopUp(title, url);
    Swal({
      title: 'Are you sure you want to delete this?',
      text: "You won't be able to revert this!",
      type: 'warning',//success
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      debugger;
      if (result.value) {
        localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
        this.router.navigate(['/invoice/invoice-creation']);
        Swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
          // 'Your imaginary file is safe :)',
          // 'error'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
          // 'Your imaginary file is safe :)',
          // 'error'
        )
      }
    })
  }
}
