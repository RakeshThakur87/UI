import { Component, OnInit,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { HttpApiService } from '../../../../../../shared/http-api.service';
import { config } from '../../../../../../shared/constant';
import { parse } from 'querystring';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-ledger-editors',
  templateUrl: 'groupledger-list.html',
  styleUrls: ['./groupledger-list.css'],
  providers: [HttpApiService],
})
export class GroupLedgerListComponent implements OnInit {
   groups: any;
   private groupList: any[] = [];
   private companyList: any = [];
   private groupdetails: Object = {};
   groupFlag: boolean;
   private confirmModalFlag = false;
   private successMessage = "";
   private errorMessage = "";
   private flag = true;
   
   private apiResponsesLoderFlag: any = [];
   private AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  constructor(private httpApiService: HttpApiService,private elementRef: ElementRef) { 
    this.bindData();
  }


  ngOnInit() { 
    this.getAllCompanyList();
  }

  bindData(){
    this.apiResponsesLoderFlag.push(true)
    let url = "group/getgroupledger/"+this.groupdetails["company_uuid"];
    this.groupFlag = true;
    this.httpApiService.get(url)
      .then(result => {
        this.apiResponsesLoderFlag.pop();
        this.groupList = result;
        this.reloadList();
        this.groupFlag = false; 
      },
      err => {
        this.apiResponsesLoderFlag.padding();
        this.groupFlag = false;
        this.groupList = [];
        this.bindData();
        this.reloadList();
      });
    
  }

  search(){
      this.bindData();
  }

  getAllCompanyList() {
    this.apiResponsesLoderFlag.push(true);
    let authEndPoint = "fmsmastercompany";
    this.httpApiService.get(authEndPoint)
    .then(res => {
        this.apiResponsesLoderFlag.pop();
        if(res){
          this.companyList = res;
          let companylistObject =  this.companyList.sort(function (a, b) {
              let company_short_nameA = a.company_short_name.toUpperCase(); // ignore upper and lowercase
              let company_short_nameB = b.company_short_name.toUpperCase(); // ignore upper and lowercase
              if (company_short_nameA < company_short_nameB) {
                return -1;
              }
              if (company_short_nameA > company_short_nameB) {
                  return 1;
              }
              // names must be equal
              return 0;
          });
          this.groupdetails["company_uuid"] = this.companyList[0].company_uuid;
          this.bindData();
        }
    },
    err => {
        this.apiResponsesLoderFlag.pop();
        console.log("ERROR");
    });
  }

  reloadList() {
    // if (jQuery("table[id*='DataTables_Table_']").length > 0) {
    //   let table = jQuery("table[id*='DataTables_Table_']").DataTable();
    //   table.clear().draw();
    //   table.rows.add(this.groupList);
    //   table.columns.adjust().draw();
    //   let elementsDivs = this.elementRef.nativeElement.querySelectorAll('.group-delete-btn');
    //   elementsDivs.forEach(element => {
    //     element.addEventListener('click',
    //       (event) => this.deleteBranchConfirm(element.rel));
    //   });
    // }
  }

  ngAfterContentChecked() {
      let elementsDivs = this.elementRef.nativeElement.querySelectorAll('.group-delete-btn');
      elementsDivs.forEach(element => {
        this.flag = false;
        element.addEventListener('click',
          (event) => this.deleteBranchConfirm(element.rel));
      });
  }

  private deleteBranchConfirm(row) {
    let data = JSON.parse(row);
    Swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this records!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes'
      })
     .then((willDelete) => {
          if (willDelete) {
            this.deleteGroup(data.cost_category_uuid);
          } else {
            Swal("Your imaginary file is safe!");
      }
   });
  }

  deleteGroup(group_uuid){
        let authEndPoint ="group/deletegroupbyuuid";
        let bodyObject: Object = {}
        let hmacString = "";
        bodyObject['group_uuid'] = group_uuid;
        this.httpApiService.post(authEndPoint,bodyObject)
            .then(res => {
                this.successMessage = "Record has been deleted successfully";
                this.bindData();
            }, err => {
                console.log("ERROR : district data not found"+JSON.stringify(err));
            });
            this.confirmModalFlag = false; 
    }

  public detailsFormat(d) {
    return `<table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
            <tbody>
           <tr>
                <td style="width:130px">Parent Budget Group:</td>
                <td>${d.parent_budget_group_name}</td>
            </tr>
           </tbody>
        </table>`
  }
}
