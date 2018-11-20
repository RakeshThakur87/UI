import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// other imports here...
import Swal from 'sweetalert2'
import { config } from '../../../../../shared/constant';
import { IndustryService } from '../../../../../core/services/industry.service';

@Component({
  selector: 'application-detail',
  templateUrl: './industry-list.html',
  styleUrls: ['./industry-list.css'],
  providers: [IndustryService]
})
export class DesignationListComponent implements OnInit {
  ;
  public apiResponsesLoderFlag = [];
  private ListObj: any = [];
  private elements: any = {};
  public rowSelected: number;
  public ModeOfInvoiceSendList: any = [];
  emailmodel: any = {};
  display = 'none';

  constructor(public apiService: IndustryService, private router: Router) {
  }

  ngOnInit() {
    this.getlistDetail();
  }

  getlistDetail() {
    this.apiResponsesLoderFlag.push(true);
    this.apiService.GetIndustryddlList().subscribe(res => {
      ;
      this.ListObj = res;
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
  onedit() {
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
