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


//@FadeInTop()
@Component({
  selector: 'app-cost-center-editors',
  styleUrls: ['./cost-center-creation.component.css'],
  templateUrl: 'cost-center-creation.component.html',
  providers: [AccountingService]
})

export class CostCenterCreationComponent implements OnInit {
  private companyList: any[];
  private costCenterInfo: Object = {};
  private costCenterCategories: any[];
  private costCenters: any = [];
  private showAssociation: boolean = false;
  private companyUuid: any;
  private url: string;
  private navigateURL: string;
  private id: any;
  private uuid: any;
  private isSubmited: boolean = false;
  private errorMessage = "";
  private costCenterCode = false;
  private apiResponsesLoderFlag = [];
  //private AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  private cost_center_code: any;
  private routingFrom = 'costCentre';
  private spinnerEnable = false;
  session_cost_center_uuid:any;
  session_cost_center_name:any;

  private addressError = "";
  private successMessage = "";
  private isAdd: boolean = true;
  private registrationError = "";
  private bankDetailError="";
  private bankSuccessMessage="";
  private validatorOptions: any = {};
  private addressSuccessMessage = "";
  private isBackToListing: any = "close";
  private registrationSuccessMessage = "";
  private isSubmittedRegData: any = false;
  private isSubmittedBankDetailData: any = false;
  private isSubmittedAddressData: any = false;
  private userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
  private addressParams: Object = { 'actionType': '', 'uuid': '', 'type': 'costCentre' };
  private registrationParams: Object = { 'actionType': '', 'uuid': '', 'type': 'costCentre' };
  private bankDetailParams: Object = { 'actionType': '', 'uuid': '', 'type': 'costCentre' };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: AccountingService) {
    this.costCenterInfo["company_uuid"] = "";
    this.costCenterInfo["status"] = "1";
    this.costCenterInfo["cost_category_uuid"] = "";
    this.costCenterInfo["parent_cost_centre_uuid"] = "";
    // this.url = CostCenterCreationConstants.Branch_Cost_Center_Association_URL;
    // this.navigateURL = CostCenterCreationConstants.Cost_Center_After_Save_Navigation_URL;
    this.cost_center_code = Math.floor(1000000 + Math.random() * 9999999);
    this.costCenterInfo["cost_center_code"] = this.cost_center_code;
    this.costCenterInfo["is_primary"] = true;
    this.costCenterInfo["enable"] = true;
    this.getCostCategories();
  }

 //@Input()
  public set modalActionType(params) {
    if (params) {
      this.routingFrom = (params['routingFrom'] || "").toLowerCase();
      if (this.routingFrom == "costcentrecreationbymodal" && params['requestType'].toLowerCase() == 'create') {
        this.id = "";
        this.showAssociation = false;
        this.isAdd = true;
        //this.getCompanies();
      } else if (this.routingFrom == "costcentrecreationbymodal" && params['requestType'].toLowerCase() == 'update') {
        this.id = params['uuid'];
        this.uuid = this.id;
        this.showAssociation = false;
        this.isAdd = false;
        this.getCostCenterDetail();
      }
    }
  }
  //@Output() costCentreModal = new EventEmitter();

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] && this.routingFrom == "costCentre") {
        this.id = params['id'];        
        this.uuid = this.id;
        this.isAdd = false;
        this.getCostCenterDetail();
      } else if (this.routingFrom == "costCentre") {
        //this.getCompanies();
        this.isAdd = true;
      }
    });
    this.setValidation();
  }

  resetForm() {
    this.costCenterInfo = {};    
    this.costCenterInfo["company_uuid"] = "";
    this.costCenterInfo["status"] = "1";
    this.costCenterInfo["cost_category_uuid"] = "";
    this.costCenterInfo["parent_cost_centre_uuid"] = "";
    this.cost_center_code = Math.floor(1000000 + Math.random() * 9999999);
    this.costCenterInfo["cost_center_code"] = this.cost_center_code;
    this.costCenterInfo["is_primary"] = true;
    this.costCenterInfo["enable"] = true;
    this.addressParams = { 'actionType': '', 'uuid': '', 'type': 'costCentre' };
    this.registrationParams = { 'actionType': '', 'uuid': '', 'type': 'costCentre' };
    this.bankDetailParams= { 'actionType': '', 'uuid': '', 'type': 'costCentre' };
  }

  emitCostCentreModal() {
    //this.costCentreModal.emit();
    this.showAssociation = false;
    this.resetForm();
  }

  resetErrors() {
    this.errorMessage = "";
  }

  getCostCenterDetail() {  
    this.apiResponsesLoderFlag.push(true);
    //let ssoToken = this.utility.getToken();
    //let hmacString = this.id + config.MODULE_HMAC;
    //let hmac = this.utility.sha1(hmacString);
    let authEndPoint = "costcenter/" + this.id;
    this.apiService.getCostCenterdroplist()
      .subscribe(res => {
        if (res) {
          this.costCenterInfo = res;    
          this.session_cost_center_uuid = res.parent_cost_center_uuid;
          this.session_cost_center_name = res.parent_cost_center_name;

          //this.getCompanies();
        
          if (res.is_primary) {
            this.getCostCategories();
          } else {
            this.getCostCenterForUserUuid();
          }
          let addressObj = {
            'actionType': 'get',
            'uuid': this.id,
            'type': 104,
            'status': this.costCenterInfo["status"]
          };
          this.addressParams = addressObj;
          let registrationsObj = {
            'actionType': 'get',
            'uuid': this.id,
            'type': 104,
            'status': this.costCenterInfo["status"]
          };
          this.registrationParams = registrationsObj; 

          let bankdetailsObj = {
            'actionType': 'get',
            'uuid': this.id,
            'type': 104,
            'status': this.costCenterInfo["status"]
          };
          this.bankDetailParams = bankdetailsObj;          
          this.apiResponsesLoderFlag.pop();
        }
      }, err => {
        this.apiResponsesLoderFlag.pop();
      });
      this.enableSubmitButtons();
  }

 

  getCostCategories() {
    this.apiResponsesLoderFlag.push(true);
    this.apiService.getCostCategoryList()
      .subscribe(res => {
        this.costCenterCategories = res;
        this.apiResponsesLoderFlag.pop();
      })
  }

  getCostCenterForUserUuid() {
    this.apiResponsesLoderFlag.push(true);
    //this.utility.sha1(this.costCenterInfo["company_uuid"])
    this.apiService.getCostCenterdroplist(
      )
      .subscribe(res => {
        this.costCenters = res.response as any[];
        if (!this.isAdd) {
          this.costCenterInfo['parent_cost_centre_uuid'] = { cost_centre_uuid: this.session_cost_center_uuid, cost_centre_name:  this.session_cost_center_name };
        }
        else
        {
          this.costCenterInfo['parent_cost_centre_uuid'] = { cost_centre_uuid: "select", cost_centre_name: 'Select Cost Centre' };
        }

        this.apiResponsesLoderFlag.pop();
      })
  }

  isPrimaryChanged(event) {    
    if (!event.target.checked) {
      // this.getCostCategories();
      this.costCenterInfo["cost_category_uuid"] = "";
      this.getCostCenterForUserUuid();
    }
    else
    {
      this.costCenterInfo['parent_cost_centre_uuid'] = { cost_centre_uuid: "select", cost_centre_name: 'Select Cost Centre' };
    }
  }

  loaderOutput(response: Object) {
    if (response['type'] == 'push') {
      this.apiResponsesLoderFlag.push(true);
    } else {
      this.apiResponsesLoderFlag.pop();
    }
  }

  submitAddressResponse(response: Object) {
    if (response['type'] == 'success') {
      this.addressSuccessMessage = response['success'];
    } 
    else {
      this.addressError = response['error'];
    }
    this.isSubmittedAddressData = true;
    if (this.isSubmittedAddressData) {
      this.showAssociation = this.isAdd ? true : false;
    }
    if (!this.showAssociation && this.isSubmittedAddressData) {
      this.finalResponse();
    }    
    this.enableSubmitButtons();
  }

  submitRegistrationResponse(response: Object) {
    if (response['type'] == 'success') {
      this.registrationSuccessMessage = response['success'];
    } 
    else {
      this.registrationError = response['error'];
    }

    this.isSubmittedRegData = true;
    if (this.isSubmittedRegData) {
      this.showAssociation = this.isAdd ? true : false;
    }
    if (!this.showAssociation && this.isSubmittedRegData) {
      this.finalResponse();
    }    
    this.enableSubmitButtons();
  }

  submitBankDetailResponse(response: Object) {
    if (response['type'] == 'success') {
      this.bankSuccessMessage = response['success'];
    } else {
      this.bankDetailError = response['error'];
    }
    this.isSubmittedBankDetailData = true;
    if (this.isSubmittedBankDetailData) {
      this.showAssociation = this.isAdd ? true : false;
    }
    if (!this.showAssociation && this.isSubmittedBankDetailData) {
      this.finalResponse();
    }
    this.enableSubmitButtons();
  }

  finalResponse() {
    if (this.routingFrom == "costcentrecreationbymodal" && this.isAdd) {
      //this.costCentreModal.emit();
    } else if (this.isBackToListing == 'close') {
      this.router.navigate([this.navigateURL]);
    } else if (this.isBackToListing == 'new') {
      this.successMessage = "Cost Center has been " + (this.isAdd ? "submitted " : "updated ") + "successfully";
      this.resetForm();
    }    
    this.enableSubmitButtons();
  }

  submitForm(isBackToListing) {
    this.isBackToListing = isBackToListing;
    if (this.validateFrom() && !this.isSubmited) {
      this.spinnerEnable = true;
      this.costCenterInfo["enable"] = false;
      this.costCenterInfo["user_uuid"] = this.userInfo.user_uuid;
      if (!this.costCenterInfo["is_primary"]) {
        this.costCenterInfo["parent_cost_center_uuid"] = this.costCenterInfo["parent_cost_centre_uuid"].cost_centre_uuid;
      }

      this.apiResponsesLoderFlag.push(true);
      this.apiService.InsertCostCenterData(this.costCenterInfo["user_uuid"])
        .subscribe(res => {
          if (res != undefined && res != '' && res != null) {
            if (res.status == 409 && res.message == "Cost centre with the same name already exists") {
              this.showAssociation = false;
              this.errorMessage = res.message;
            } 
            else if (res.status == 200 && res.response.length > 0) {
              //this.showAssociation = res.response != '' && res.response != undefined;
              this.uuid = res.response;
              let addressObj = {
                'actionType': 'post',
                'uuid': this.uuid,
                'type': 104,
                'status': this.costCenterInfo["status"]
              };
              this.addressParams = addressObj;
              let registrationsObj = {
                'actionType': 'post',
                'uuid': this.uuid,
                'type': 104,
                'status': this.costCenterInfo["status"]
              };
              this.registrationParams = registrationsObj;
              let bankdetailsObj = {
                'actionType': 'post',
                'uuid': this.id,
                'type': 104,
                'status': this.costCenterInfo["status"],
                'page_uuid':res.response
              };
              this.bankDetailParams = bankdetailsObj; 
              

            } 
            else {
              this.errorMessage = res.message;
            }
          } 
          else {
            this.errorMessage = "Error in submitting details.";
          }
          this.isSubmited = false;
          this.apiResponsesLoderFlag.pop();
          this.enableSubmitButtons();
        }, err => {
          this.isSubmited = false;
          this.spinnerEnable = false;
          this.errorMessage = "Error in submitting details.";
          this.enableSubmitButtons();
          this.apiResponsesLoderFlag.pop();
        });
    } else {
      this.errorMessage = "Please fill the required valid information.";
      this.enableSubmitButtons();
    }
  }

  enableSubmitButtons() {
    this.costCenterInfo["enable"] = true;
    //jQuery(':input[type="submit"]').prop('disabled', false);
  }

  private validateFrom() {
    this.resetErrorMessage();
    let flag = true;
    if (!(this.costCenterInfo['company_uuid'].length > 0)) {
      flag = false;
    }
    if (!(this.costCenterInfo['cost_center_name'].length > 0)) {
      flag = false;
    }
    if (this.costCenterInfo['is_primary']) {
      if (!(this.costCenterInfo['cost_category_uuid'].length > 0)) {
        flag = false;
      }
    } else {
      if (this.costCenterInfo['parent_cost_centre_uuid'].cost_centre_uuid == "") {
        flag = false;
      }
    }
    return flag;
  }

  private resetErrorMessage() {
    this.addressError = "";
    this.errorMessage = "";
    this.successMessage = "";
    this.registrationError = "";
    this.addressSuccessMessage = "";
    this.registrationSuccessMessage = "";
    this.bankSuccessMessage="";
  }

  setValidation() {
    this.validatorOptions = {
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        costCenterName: {
          group: '.costCenterName',
          validators: {
            notEmpty: {
              message: 'Cost center name is required'
            },
            stringLength: {
              min: 4,
              max: 200,
              message: 'Cost center name must be between 4-200 characters'
            },

          },
        },
        company: {
          group: '.company',
          validators: {
            notEmpty: {
              message: 'Please select company.'
            }
          },
        },
        status: {
          group: '.status',
          validators: {
            notEmpty: {
              message: 'Please select status.'
            }
          },
        },
        costCategory: {
          group: '.costCategory',
          validators: {
            notEmpty: {
              message: 'Please select cost center category.'
            }
          },
        },
        underCostCenter: {
          group: '.underCostCenter',
          validators: {
            notEmpty: {
              message: 'Please select cost center.'
            }
          },
        },
      }
    }
  }
}