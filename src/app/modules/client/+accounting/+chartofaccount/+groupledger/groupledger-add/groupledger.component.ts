import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { HttpApiService } from '../../../../../../shared/http-api.service';
import { config } from '../../../../../../shared/constant';
import { Utility } from '../../../../../../shared/Utility';
import { parse } from 'querystring';
import Swal from 'sweetalert2';

@Component({
    providers: [Utility,HttpApiService],
    selector: 'cost-category',
    templateUrl: 'cost-category.html',
})

export class GroupLedgerCreationComponent implements OnInit{
    private elements:any = {};
    private companylist:any[] = [];
    private apiResponsesLoderFlag = [];
    private success: any;
    private submit: boolean;
    private error: any;
    private update:boolean;
    private id:any;
    private AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(private httpApiService: HttpApiService, private aimsapiService: HttpApiService, private route: ActivatedRoute, private router: Router){
        this.getAllCompanyList();
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
        this.httpApiService.get(authEndPoint)
        .then(res => {
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

    getAllCompanyList() {
        this.apiResponsesLoderFlag.push(true);
        let authEndPoint = "fmsmastercompany";
        this.httpApiService.get(authEndPoint)
        .then(res => {
            this.apiResponsesLoderFlag.pop();
            if(res.length > 0){
                this.companylist =  res.sort(function (a, b) {
                    let  company_short_nameA = a.company_short_name.toUpperCase(); // ignore upper and lowercase
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
    this.httpApiService.put(authEndPoint,this.elements)
        .then(res=>{
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
      this.httpApiService.post(this.elements, authEndPoint)
        .then(res=>{
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