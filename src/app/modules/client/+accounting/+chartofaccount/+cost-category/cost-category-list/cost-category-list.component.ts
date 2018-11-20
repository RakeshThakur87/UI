import { Component, OnInit,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// other imports here...
import Swal from 'sweetalert2'
import { config } from '../../../../../../shared/constant';
import { AccountingService } from '../../../../../../core/services/accounting.service';
import { PagerService } from '../../../../../../shared/pager-service';


@Component({
    providers: [AccountingService],
    selector: 'cost-category',
    styleUrls: ['./cost-category-list.css'],
    templateUrl: 'cost-category-list.html',
})

export class CostCategoryComponent implements OnInit{
    private costcategoryFlag: boolean;
    private costcategoryList: any[] = [];
    private confirmModalFlag = false;
    private flag =  true;

    constructor(private apiService: AccountingService,private elementRef: ElementRef){
        this.costcategoryFlag = false;
    }

    ngOnInit(){
        this.bindData();
    }

    bindData(){
        let url = "CostCategory";
        this.costcategoryFlag = true;
        this.apiService.getCostCategoryList()
            .subscribe(result => { 
                this.costcategoryList = result;
                this.reloadList();
                this.costcategoryFlag = false;        
      },
      err => {
        this.costcategoryFlag = false;
        this.costcategoryList = [];
        this.reloadList();
      });
    }

    reloadList() {
    //   let table = jQuery("table[id*='DataTables_Table_']").DataTable();
    //   table.clear().draw();
    //   table.rows.add(this.costcategoryList);
    //   table.columns.adjust().draw();
    //   let elementsDivs = this.elementRef.nativeElement.querySelectorAll('.cost-category-delete-btn');
    //   elementsDivs.forEach(element => {
    //     element.addEventListener('click',
    //       (event) => this.deleteCostCenterConfirm(element.rel));
    //   });
  }

  ngAfterContentChecked() {   
      let elementsDivs = this.elementRef.nativeElement.querySelectorAll('.cost-category-delete-btn');
      elementsDivs.forEach(element => {
        this.flag = false;
        element.addEventListener('click',
          (event) => this.deleteCostCenterConfirm(element.rel));
      });
    
  }

  private deleteCostCenterConfirm(row) {
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
            this.deleteCostCategory(data.cost_category_uuid);
          } else {
            Swal("Your imaginary file is safe!");
      }
   });
  }

  deleteCostCategory(cost_category_uuid){
        let authEndPoint ="CostCategory/Delete";
        let bodyObject: Object = {}
        bodyObject['cost_category_uuid'] = cost_category_uuid;
        this.apiService.deleteCostCategory(cost_category_uuid)
            .subscribe(res => {
                this.bindData();
            }, err => {
                console.log("ERROR : district data not found"+JSON.stringify(err));
            });
            this.confirmModalFlag = false; 
    }
}