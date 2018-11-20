import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { appSettings } from '../../../../../../configs/app-settings.config';
import { appToaster } from '../../../../../../configs/app-toaster.config';

import { ToasterService } from 'angular2-toaster';
import { AccountingService } from '../../../../../../core/services/accounting.service';

import { environment } from '../../../../../../../environments/environment';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';

const URL  = `${environment.host}${environment.fileupload}`;

@Component({
    providers: [AccountingService],
    selector: 'cost-category',
    templateUrl: 'cost-category.html',
})

export class CostCategoryCreateComponent implements OnInit{
    private elements:any = {};
    private companylist:any[] = [];
    private apiResponsesLoderFlag = [];
    private success: any;
    private submit: boolean;
    private error: any;
    private update:boolean;
    private id:any;
    //private AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(private apiService: AccountingService,private route: ActivatedRoute, private router: Router){        
        this.elements["status"] = 1;
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
        this.submit = true;
        if (params['id']) {
            this.id = params['id'];
            this.update = true;
            this.submit = false;
            this.getCostCategoryDetail(this.id);
        }
        });
    }

    removeMessage(){
        this.error = "";
        this.success="";
    }
    
    getCostCategoryDetail(cost_category_uuid){
        this.apiResponsesLoderFlag.push(true);
        let authEndPoint = "CostCategory/"+cost_category_uuid;
        this.apiService.getCostCategoryList()
        .subscribe(res => {
            this.apiResponsesLoderFlag.pop();
            if(res){
            this.elements = res;   
            }
        },
        err => {
            this.apiResponsesLoderFlag.pop();
            console.log("ERROR");
        });
    }

  onSubmit(){
      this.route.params.subscribe(params => {
        if (params['id']) {
            this.updateCostCategory(params['id']);
        }else{
            this.submitCostCategory();
        }
        });
  }

  updateCostCategory(cost_category_uuid){
    this.apiResponsesLoderFlag.push(true);
    let isValidForm = true;
    if(!this.elements["cost_category_name"]){
        isValidForm = false;
    }else{
        if(this.elements["cost_category_name"]){
        let costCategoryName = this.elements["cost_category_name"].toString().length;
        if(costCategoryName > 100){
            isValidForm = false;
            this.error="Please fill the required valid information.";
        }
    }
    }
    let authEndPoint = "CostCategory/"+cost_category_uuid;
    this.elements["cost_category_uuid"] = cost_category_uuid;
    this.elements["is_deleted"] = false;
    this.elements['modified_by'] = 1;
    this.elements["hmac"]="abc";
    if(isValidForm){
    this.apiService.UpdateCostCategoryData(this.elements)
        .subscribe(res=>{
          this.apiResponsesLoderFlag.pop();
          if(res){
              if(res.value=="cost category name Already Assigned."){
                  this.error=res.value;
              }else{
                this.elements = {};
                this.success="Cost Category update successfully";
              } 
          }
        },err=>{
            this.apiResponsesLoderFlag.pop();
        })
    }else{
        this.apiResponsesLoderFlag.pop();
    }
    }
  
  submitCostCategory(){
    this.apiResponsesLoderFlag.push(true);
    let isValidForm = true;
    if(!this.elements["cost_category_name"]){
        isValidForm = false;
    }else{
        if(this.elements["cost_category_name"]){
        let costCategoryName = this.elements["cost_category_name"].toString().length;
        if(costCategoryName > 100){
            isValidForm = false;
            this.error="Please fill the required valid information.";
        }
    }
    }
    if(isValidForm){
      let authEndPoint = "CostCategory";
      this.elements["is_deleted"] = false;
      this.elements['created_by'] = 1;
      this.elements["hmac"]="abc";
      this.apiService.InsertCostCategoryData(this.elements)
        .subscribe(res=>{
          this.apiResponsesLoderFlag.pop();
          if(res){
              if(res.value=="cost category name Already Assigned."){
                  this.error=res.value;
              }else{
                this.elements = {};
                this.elements["status"] = "1";
                this.success="Cost Category added successfully";
              }
          }
        },err=>{
            this.apiResponsesLoderFlag.pop();
        })
    }else{
        this.apiResponsesLoderFlag.pop();
    }
  }
}