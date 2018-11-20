import { Component, OnInit,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { HttpApiService } from '../../../../../../shared/http-api.service';
// import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
// import { setTheme } from 'ngx-bootstrap/utils';
import { config } from '../../../../../../shared/constant';
import { parse } from 'querystring';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ledger-editors',
  templateUrl: 'ledger.component.html',
  styleUrls: ['./ledger.component.css'],
  providers: [HttpApiService],
})
export class LedgerComponent implements OnInit {
  groups: any;
  private ledgerFlag: boolean;
  private ledgerList: any[] = [];
  private confirmModalFlag = false;
  private flag = true;
  private successMessage = "";
  private errorMessage = "";
  private companyList = [];
  private branchList = [];
  private userInfo = JSON.parse(localStorage.getItem('userInfo'));
  private apiResponsesLoderFlag: any = [];
  public options: any;
  private ledgerDetails = {};
  private static branchUuid ="";
  private AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  is_superadmin = "";

  constructor(private elementRef: ElementRef,private httpApiService: HttpApiService) {
    this.ledgerFlag = false;
    this.successMessage = "";
    this.errorMessage = "";
    this.ledgerDetails['company_uuid'] = "";
    this.ledgerDetails['branch_uuid'] = "";
    this.dataList();
    this.is_superadmin = localStorage.getItem("is_user_superadmin");
  }

  getComapnyList() {
    if (this.companyList.length == 0) {
      let companyUrl = "CompanyInfo/getcompanylistByUser/" + this.userInfo.user_uuid;
      let moduleTag = "1111";
      this.apiResponsesLoderFlag.push(true);
      this.httpApiService.get(companyUrl).then(res => {
        if (res.response) {
          this.companyList = res.response;
          if(this.companyList.length>0){
            this.ledgerDetails['company_uuid'] = this.companyList[0].company_uuid;
            this.getBranchList(this.ledgerDetails['company_uuid']);
          } else{
            this.errorMessage = "ERROR : company data not found";
          }
        }
        this.apiResponsesLoderFlag.pop();
      }, err => {
        this.errorMessage = "ERROR : company data not found";
        this.apiResponsesLoderFlag.pop();
      });
    } else {
      this.bindData();
    }
  }

  onBranchChange(){
    LedgerComponent.branchUuid = this.ledgerDetails['branch_uuid'];
  }

  getBranchList(companyUuid) {
    if (this.ledgerDetails['company_uuid'].length > 0) {
      let branchUrl = "fmsmasterbranch/getallbranchesbyuseruuid/" + companyUuid + "/" + this.userInfo.user_uuid;
      let moduleTag = "1111";
      this.apiResponsesLoderFlag.push(true);
      this.httpApiService.get(branchUrl).then(res => {
        if (res.response) {
          this.branchList = res.response;
          this.ledgerDetails['branch_uuid'] = "";
          if (this.branchList.length > 0) {
            this.ledgerDetails['branch_uuid'] = this.branchList[0].branch_uuid;
            this.onBranchChange()
            this.bindData();
          } else {
            this.errorMessage = "ERROR : branch data not found";
          }
        }
        this.apiResponsesLoderFlag.pop();
      }, err => {
        this.errorMessage = "ERROR : branch data not found";
        this.apiResponsesLoderFlag.pop();
      });
    }
  }

  // checkAll(event) {
  //   jQuery("#select_all_groups").change(function () {  //"select all" change
  //     jQuery(".groupcheckbox").prop('checked', jQuery(this).prop("checked")); //change all ".checkbox" checked status
  //   });

  //   //".checkbox" change
  //   jQuery('.groupcheckbox').change(function () {
  //     //uncheck "select all", if one of the listed checkbox item is unchecked
  //     if (false == jQuery(this).prop("checked")) { //if this item is unchecked
  //       jQuery("#select_all_groups").prop('checked', false); //change "select all" checked status to false
  //     }
  //     //check "select all" if all checkbox items are checked
  //     if (jQuery('.groupcheckbox:checked').length == jQuery('.checkbox').length) {
  //       jQuery("#select_all_groups").prop('checked', true);
  //     }
  //   });
  // }


  ngOnInit() {
    this.getComapnyList();
    this.bindData();
  }

  dataList() {
    this.options = {
      data: this.ledgerList,
      "iDisplayLength": 10,
      "aaSorting": [],
      "order": [],
      "columns": [
        {
          "data": 'ledger_uuid',
          'mRender': function (data, a, allData, type, row) {
            let buttons = '<a href="#/addledger/ledger-updation/' + allData.ledger_uuid + '"><span class=\'padding-5 glyphicon glyphicon-edit cursor-pointer\' ></span> </a>';
            buttons += '<a href="#/master/opening-balance/'+LedgerComponent.branchUuid+ '/' + allData.ledger_uuid + '"><span class=\'fa fa-balance-scale\'> </span> </a>';
            buttons += "<span> <a data-toggle='modal' rel='{ \"ledger_uuid\": \"" + data + "\",\"ledger_name\": \"" + allData.ledger_name + "\"}' class='txt-color-red cursor-pointer glyphicon glyphicon-trash voucher-delete-btn' title='delete'></a></span> ";
            buttons +='<a href="#/addledger/add-branch/' + allData.ledger_uuid + "/" + allData.company_uuid +'"><span class=\' txt-color-green cursor-pointer padding-5 glyphicon glyphicon-plus cursor-pointer title=add branch \' ></span> </a>';
            return buttons;
          }
        },
        { "data": "ledger_name" },
        { "data": "ledger_code" },
        { "data": "group_name" },

      ],
      buttons: [
        'excel', 'pdf'
      ]
    }
  }

  bindData() {
    let url = "Ledger";
    this.ledgerFlag = true;
    this.httpApiService.get(url)
      .then(result => {
        this.ledgerFlag = false;
        this.ledgerList = result;
        this.dataList();
        this.reloadList();

      },
      err => {
        this.ledgerFlag = false;
        this.ledgerList = [];
        this.dataList();
        this.reloadList();
      });
  }

  reloadList() {
    // if (jQuery("table[id*='DataTables_Table_']").length > 0) {
    //   let table = jQuery("table[id*='DataTables_Table_']").DataTable();
    //   table.clear().draw();
    //   table.rows.add(this.ledgerList);
    //   table.columns.adjust().draw();
    //   let elementsDivs = this.elementRef.nativeElement.querySelectorAll('.voucher-delete-btn');
    //   elementsDivs.forEach(element => {
    //     if(this.is_superadmin != "true")
    //     {
    //       element.style.display = "none";
    //     }
    //     element.addEventListener('click',
    //       (event) => this.deleteLedgerConfirm(element.rel));
    //   });
    // }
  }

  ngAfterContentChecked() {
    let elementsDivs = this.elementRef.nativeElement.querySelectorAll('.voucher-delete-btn');
    elementsDivs.forEach(element => {
      this.flag = false;
      if(this.is_superadmin != "true")
      {
        element.style.display = "none";
      }
      element.addEventListener('click',
        (event) => this.deleteLedgerConfirm(element.rel));
    });
  }

  private deleteLedgerConfirm(row) {
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
            this.deleteLedger(data.cost_category_uuid);
          } else {
            Swal("Your imaginary file is safe!");
      }
   });
  }

  deleteLedger(ledger_uuid) {
    let authEndPoint = "ledger/deleteledgerbyuuid";
    let bodyObject: Object = {}
    bodyObject['ledger_uuid'] = ledger_uuid;
    this.httpApiService.post(bodyObject, authEndPoint)
      .then(res => {
        this.successMessage = "Record has been deleted successfully";
        this.bindData();
      }, err => {
        console.log("ERROR : ledger data not found");
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
