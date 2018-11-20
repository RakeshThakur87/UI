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
import { LedgerCreationConstants } from '../ledger-creation.constants';

@Component({
  selector: 'ledger-creation',
  templateUrl: './ledger-creation.component.html',
  styleUrls: ['./ledger-creation.component.css'],
  providers: [HttpApiService]
})

export class LedgerCreationComponent implements OnInit {
  private uuid: string= "";
  private url: string;
  private navigateURL: string = '';
  private groupLedgers: any = [];
  private leadgerCategories: any = [];
  private taxTypes: any = [];
  private budgetLedgers: any = [];
  private openingBalance: any = 'NA';
  private session: any = 'NA';
  private balanceType: any = 'NA';
  private showAssociation: boolean = false;
  private ledgerTypeTaxSelected: boolean = false;
  private ledgerTypeOtherSelected: boolean = true;
  private tdsTaxuuid: any = "";
  private serviceTaxUuid: any = "";
  private vatTaxUuid: any = "";
  private ledgercode = false;
  private selectedCostCenter: any = {};
  private costcategoryrequired: boolean = false;
  private apiResponsesLoderFlag = [];
  private category: any = [];
  private AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
  private ledger_code: any;

  private elements: Object = {};
  private companylist: any = [];
  private ledgerObj: Object = {};
  private visibleTabs: Object = {};
  private optionsModel: number[];
  //private costCenterCategories: IMultiSelectOption[] = [];
  private multiSelectSettings = {};
  //private multiSelectTextSettings: IMultiSelectTexts;
  private listingLink = "/ledger/ledger";
  private validatorOptions: any = {};
  private isAdd: boolean = true;
  private spinnerEnable = false;
  private addressError = "";
  private errorMessage = "";
  private successMessage = "";
  private registrationError = "";
  private employeeError = "";
  private addressSuccessMessage = "";
  private groupLedgerErrorMessage = "";
  private registrationSuccessMessage = "";
  private employeeSuccessMessage = "";
  private isSubmited: boolean = false;
  private user = localStorage.getItem('user');
  private ledgerDetails: Object = {};
  private addressParams: Object = { 'actionType': '', 'uuid': '', 'type': 'ledger' };
  private registrationParams: Object = { 'actionType': '', 'uuid': '', 'type': 'ledger' };
  private employeeParams: Object = { 'actionType': '', 'uuid': '', 'type': 'ledger' };
  private userInfo: any = JSON.parse(localStorage.getItem('userInfo'));
  private isSubmittedAddressData: any = false;
  private isSubmittedRegData: any = false;
  private isBackToListing: any = "close";
  private routingFrom = 'ledger';

  constructor(private route: ActivatedRoute, private router: Router, 
    private httpApiService: HttpApiService, private elementRef: ElementRef) {
    this.url = LedgerCreationConstants.Branch_Ledger_Association_URL;
    this.navigateURL = LedgerCreationConstants.Ledger_After_Save_Navigation_URL;
    this.elements["status"] = "1";
    this.elements["group_ledger_uuid"] = { group_ledger_uuid: "select", group_ledger_name: 'Select Group Ledger' };
    this.elements["ledger_type_id"] = "4";
    this.elements["is_for_tax"] = false;
    this.elements["is_bill_detail_required"] = false;
    this.elements["type_of_tax_uuid"] = "";
    this.elements['category'] = [];
    this.ledger_code = Math.floor(1000000 + Math.random() * 9999999);
    this.elements["ledger_code"] = this.ledger_code;

    this.elements["enable"] = true;
    this.elements["company_uuid"] = "";
    this.multiSelectSettings = {
      containerClasses: 'input-container',
      enableSearch: true,
      checkedStyle: 'fontawesome',
      buttonClasses: 'category btn btn-default btn-block',
      dynamicTitleMaxItems: 1,
      displayAllSelectedText: true,
    }
    // this.multiSelectTextSettings = {
    //   checkAll: 'Select all',
    //   uncheckAll: 'Unselect all',
    //   checked: 'item selected',
    //   checkedPlural: 'items selected',
    //   searchPlaceholder: 'Search value',
    //   defaultTitle: 'select Cost Center Category',
    //   allSelected: 'All selected',
    // }
  }

 // @Input()
  public set modalActionType(params) {
    if (params) {
      this.routingFrom = (params['routingFrom'] || "").toLowerCase();
      if (this.routingFrom == "ledgermodal" && params['requestType'].toLowerCase() == 'create') {
        this.showAssociation = false;
        this.isAdd = true;
        this.getCompany();
      } else if (this.routingFrom == "ledgermodal" && params['requestType'].toLowerCase() == 'update') {
        this.showAssociation = false;
        this.isAdd = false;
        this.getCompany();
      }
    }
  }
  
  //@Input()
  private set ledgerUuid(value: string) {
    this.uuid = value;
    if (this.routingFrom == 'ledgermodal' && this.uuid.length > 0) {
      this.isAdd = false;
      this.getLedgerDetail();
    }
  }

  //@Output() ledgerModal = new EventEmitter();

  ngOnInit() {
    this.getCompany();
    this.getleadgerCategories();
    this.getTypeOfTaxes();
    this.route.params.subscribe(params => {
      this.isAdd = true;
      if (params['id'] || this.uuid.length > 0) {
        this.uuid = params['id'];
        this.getLedgerDetail();
        this.isAdd = false;        
       }        
      //else {
      //   this.getCostCategories();
      // }
      this.getCostCategories();
    });
    this.setValidation();
  }

  /**
   * method for reset the form inputs. 
   */

  resetForm() {
    this.elements["status"] = "1";
    this.elements["group_ledger_uuid"] = { group_ledger_uuid: "select", group_ledger_name: 'Select Group Ledger' };
    this.elements["ledger_type_id"] = "4";
    this.elements["is_for_tax"] = false;
    this.elements["is_bill_detail_required"] = false;
    this.elements["type_of_tax_uuid"] = "";
    this.elements['category'] = [];
    this.ledger_code = Math.floor(1000000 + Math.random() * 9999999);
    this.elements["ledger_code"] = this.ledger_code;
    this.elements["enable"] = true;
    this.elements["company_uuid"] = "";
    this.addressParams = { 'actionType': '', 'uuid': '', 'type': 'ledger' };
    this.registrationParams = { 'actionType': '', 'uuid': '', 'type': 'ledger' };
    this.employeeParams = { 'actionType': '', 'uuid': '', 'type': 'ledger' };
    this.elements["ledger_name"] = "";
    this.elements["is_costcenter_required"] = false;
  }

  /**
   * method for emit the source method of ledger creation on other component. 
   */
  ledgerCreationModalEmit() {
    //this.ledgerModal.emit();
    this.showAssociation = false;
    this.resetForm();
  }

  getLedgerDetail() {
    this.apiResponsesLoderFlag.push(true);
    let authEndPoint = "ledger/" + this.uuid;
    this.httpApiService.get(authEndPoint)
      .then(ledgerDetail => {
        if (ledgerDetail) {
          this.ledgerDetails = ledgerDetail;
          this.elements = ledgerDetail;
          this.onCompanyChange()
          this.elements["group_ledger_uuid"] = { group_ledger_uuid: ledgerDetail.group_uuid, group_ledger_name: ledgerDetail.group_name };          
          this.elements["ledger_type_id"] = ledgerDetail.ledger_type_id + '';
          if (ledgerDetail.is_costcenter_required) {
            this.elements['is_costcenter_required'] = ledgerDetail.is_costcenter_required;
            this.costcategoryrequired = true;
            this.getCostCategories(ledgerDetail.category);
          }
          this.ledgerCategory(ledgerDetail.ledger_type_id);
          let addressObj = {
            'actionType': 'get',
            'uuid': this.uuid,
            'type': 101,
            'status': this.elements["status"]
          };
          this.addressParams = addressObj;
          let registrationsObj = {
            'actionType': 'get',
            'uuid': this.uuid,
            'type': 101,
            'status': this.elements["status"]
          };
          this.registrationParams = registrationsObj; 
          let employeeObj = {
            'actionType': 'get',
            'uuid': this.uuid,
            'type': 101,
            'status': this.elements["status"]
          }
          this.employeeParams = employeeObj; 
          this.enableSubmitButtons();
          this.apiResponsesLoderFlag.pop();
        }
      },
      err => {
        this.apiResponsesLoderFlag.pop();
        console.log("ERROR");
      }
      );
  }

  getCompany() {
    let url = LedgerCreationConstants.Get_Companies_URL_user_uuid + this.userInfo.user_uuid;
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(url)
      .then(res => {
        if (res != undefined && res != '' && res != null) {
          this.companylist = res['response'];
          if (this.companylist.length > 0) {
            this.elements["company_uuid"] = this.companylist[0].company_uuid;
          }
          this.onCompanyChange();
          this.apiResponsesLoderFlag.pop();
        }
      },
      err => {
        this.apiResponsesLoderFlag.pop();
        console.log("ERROR");
      });
  }

  getleadgerCategories() {
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(LedgerCreationConstants.Get_Ledger_Types_URL)
      .then(res => {
        if (res != undefined && res != '' && res != null) {
          this.leadgerCategories = res;
          this.apiResponsesLoderFlag.pop();
        }
      },
      err => {
        this.apiResponsesLoderFlag.pop();
        console.log("ERROR");
      });
  }

  ledgerCategoryChanged(val) {
    this.ledgerTypeTaxSelected = this.leadgerCategories.find(x => x.ledger_type_id == val).is_tax;
    let ledgerCategoryFilterObj = this.leadgerCategories.find(x => x.ledger_type_id == val);
    this.ledgerTypeOtherSelected = this.leadgerCategories.find(x => x.ledger_type_id == val).ledger_type_name == 'Other';
    if (ledgerCategoryFilterObj.ledger_type_name == 'Taxes' && this.taxTypes.length > 0) {
      this.elements['type_of_tax_uuid'] = this.taxTypes[0].tax_type_uuid;
    } else if (this.ledgerTypeOtherSelected) {
      this.elements["is_for_tax"] = false;
      this.elements["is_bill_detail_required"] = false;
      this.elements["type_of_tax_uuid"] = "";
    }
  }

  ledgerCategory(val) {
    if (this.leadgerCategories.find(x => x.ledger_type_id == val).is_tax) {
      this.ledgerTypeTaxSelected = true;
    } else {
      this.ledgerTypeOtherSelected = this.leadgerCategories.find(x => x.ledger_type_id == val).ledger_type_name == 'Other';
    }
  }

  getTypeOfTaxes() {
    this.apiResponsesLoderFlag.push(true);
    this.httpApiService.get(LedgerCreationConstants.Get_Type_Of_Taxes_URL)
      .then(res => {
        if (res != undefined && res != '' && res != null) {
          this.taxTypes = res;
          if (this.taxTypes.length > 0) {
            this.elements['type_of_tax_uuid'] = this.taxTypes[0].tax_type_uuid;
          }
          this.apiResponsesLoderFlag.pop();
        }
      },
      err => {
        this.apiResponsesLoderFlag.pop();
        console.log("ERROR");
      });
  }

  getNameFromList(list, uuid, searchField, requiredFieldName) {
    let obj = list.find(x => x[searchField] == uuid);
    if (typeof (obj) != "undefined") {
      return obj[requiredFieldName];
    } else {
      return "";
    }
  }

  private validateFrom() {
    this.resetErrorMessage();
    let flag = true;
    if (!(this.elements['company_uuid'].length > 0)) {
      flag = false;
    }
    if (!(this.elements['group_ledger_uuid'].group_ledger_uuid != "select")) {
      this.groupLedgerErrorMessage = "Group ledger is required."
      flag = false;
    }
    if (!(this.elements['ledger_name'].length > 3 && this.elements['ledger_name'].length <= 50)) {
      flag = false;
    }
    if(this.elements["is_costcenter_required"]){
      if (!(this.elements["category"].length > 0)) {
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
    this.employeeError = "";
    this.addressSuccessMessage = "";
    this.groupLedgerErrorMessage = "";
    this.registrationSuccessMessage = "";
    this.employeeSuccessMessage = "";
  }

  private submitLedgerForm(isBackToListing) {
    this.isBackToListing = isBackToListing;
    if (this.validateFrom() && !this.isSubmited) {
      if (this.isAdd) {
        this.elements["created_by"] = this.user;
      } else {
        this.elements["modified_by"] = this.user;
        this.elements["ledger_uuid"] = this.uuid;
      }
      this.spinnerEnable = true;
      this.elements["enable"] = false;
      this.elements['hmac'] = this.getLedgerHmac(this.elements);
      let body = this.elements;
      this.isSubmited = true;
      body['group_uuid'] = this.elements['group_ledger_uuid'].group_ledger_uuid;
      let url = LedgerCreationConstants.Ledger_Creation_API_URL;
      // let url = this.isAdd ? LedgerCreationConstants.Ledger_Creation_API_URL :
        // (LedgerCreationConstants.Ledger_Creation_API_URL + "/" + this.uuid);
      this.httpApiService.post(url, body).then(ledgerResponse => {
        if (ledgerResponse != undefined && ledgerResponse != '' && ledgerResponse != null) {
          if (ledgerResponse.status == 409 && ledgerResponse.message == "Ledger with the same name already exists.") {
            this.showAssociation = false;
            this.errorMessage = ledgerResponse.message;
          } else if (ledgerResponse.status == 200 && ledgerResponse.response.length>0) {
            this.uuid = ledgerResponse.response;
            let addressObj = {
              'actionType': 'post',
              'uuid': this.uuid,
              'type': 101,
              'status': this.elements["status"]
            };
            this.addressParams = addressObj;
            let registrationsObj = {
              'actionType': 'post',
              'uuid': this.uuid,
              'type': 101,
              'status': this.elements["status"]
            };
            this.registrationParams = registrationsObj;
            let employeeObj = {
              'actionType': 'post',
              'uuid': this.uuid,
              'type': 101,
              'status': this.elements["status"]
            };
            this.employeeParams = employeeObj;
          } else {
            this.errorMessage = ledgerResponse.message;
          }
        } else {
          this.errorMessage = "Error in submitting details.";
        }
        this.isSubmited = false;
      }, err => {
        this.isSubmited = false;
        this.spinnerEnable = false;
        this.errorMessage = err;
        this.enableSubmitButtons();
      });
    } else {
      this.errorMessage = "Please fill the required valid information.";
      this.enableSubmitButtons();
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
    } else {
      this.addressError = response['error'];
    }
    this.isSubmittedAddressData = true;
    if(this.isSubmittedRegData){
      this.showAssociation = this.isAdd ? true : false;  
    }
    if(!this.showAssociation && this.isSubmittedRegData){
      this.finalResponse();
    }
  }

  submitRegistrationResponse(response: Object) {
    if (response['type'] == 'success') {
      this.registrationSuccessMessage = response['success'];
    } else {
      this.registrationError = response['error'];
    }
    this.isSubmittedRegData = true;
    if(this.isSubmittedAddressData){
      this.showAssociation = this.isAdd ? true : false;  
    }
    if(!this.showAssociation && this.isSubmittedAddressData){
      this.finalResponse();
    }
  }
  
  submitEmployeeResponse(response: Object) {
    if (response['type'] == 'success') {
      this.employeeSuccessMessage = response['success'];
    } else {
      this.employeeError = response['error'];
    }
    this.isSubmittedRegData = true;
    if(this.isSubmittedAddressData){
      this.showAssociation = this.isAdd ? true : false;  
    }
    if(!this.showAssociation && this.isSubmittedAddressData){
      this.finalResponse();
    }
  }

  finalResponse(){
    if (this.routingFrom == "ledgerModal" && this.isAdd) {
      //this.ledgerModal.emit();
    } else if (this.isBackToListing == 'close') {
      this.router.navigate([this.listingLink]);
    } else if (this.isBackToListing == 'new') {
      this.successMessage = "Ledger has been " + (this.isAdd ? "submitted " : "updated ") + "successfully";
      this.resetForm();
    }
  }

  private getLedgerHmac(ledgerInfo): string {
    let ledgerHmacString = "";
    if (!this.isAdd) {
      ledgerHmacString + this.uuid;
    }
    ledgerHmacString = ledgerHmacString + ledgerInfo.company_uuid + ledgerInfo.ledger_name + ledgerInfo.ledger_code
      + ledgerInfo.group_ledger_uuid.group_ledger_uuid + ledgerInfo.ledger_type_id
      + this.user + ledgerInfo.status + config.MODULE_HMAC;
    //return this.utility.sha1(ledgerHmacString);
    return ledgerHmacString;
  }

  onCompanyChange() {
    if (this.elements['company_uuid'].length > 0) {
      let url = "group/GetGroupLedgerHierarchy/" + this.elements['company_uuid'];
      let hmacString = this.elements['company_uuid'] + config.MODULE_HMAC;
      this.apiResponsesLoderFlag.push(true);
      if (this.isAdd){
        this.elements['group_ledger_uuid'] = { group_ledger_uuid: "select", group_ledger_name: 'Select Group Ledger' };
      }
      return this.httpApiService.get(url).then(result => {
        if (result.response) {
          this.groupLedgers = result.response as any[];
          if (this.isAdd && this.groupLedgers.length > 0) {
            this.elements['group_ledger_uuid'] = { group_ledger_uuid: this.groupLedgers[0].group_ledger_uuid, group_ledger_name: this.groupLedgers[0].group_ledger_name };
          }
        }
        this.apiResponsesLoderFlag.pop();
      })
        .catch(error => {
          this.apiResponsesLoderFlag.pop();
        });
    } else {
      this.groupLedgers = [];
      this.elements['group_ledger_uuid'] = { group_ledger_uuid: "select", group_ledger_name: 'Select Group Ledger' };
    }
  }

  enableSubmitButtons() {
    this.elements["enable"] = true;
    //jQuery(':input[type="submit"]').prop('disabled', false);
  }

  getCostCategories(selectedCategory?) {
    selectedCategory = selectedCategory || [];
    //if (this.costCenterCategories.length <= 0) {
      this.apiResponsesLoderFlag.push(true);
      this.httpApiService.get(LedgerCreationConstants.Get_Cost_Category_URL)
        .then(res => {
        //   if (res && res.length > 0) {
        //     if (this.isAdd) {
        //       this.elements["category"][0] = res[0].cost_category_uuid;
        //     } else {
        //       this.elements["category"] = selectedCategory;
        //     }
        //     this.costCenterCategories = res.filter((item: any) => {
        //       if ((typeof item === 'object' && item && item['cost_category_name'].length > 0)) {
        //         return item;
        //       }
        //     });
        //     this.costCenterCategories = this.costCenterCategories.map((item: any) => ({ id: item['cost_category_uuid'], name: item['cost_category_name'] }));
        //   } else {
        //     this.elements["category"] = [];
        //     this.costCenterCategories = [];
        //   }
          this.apiResponsesLoderFlag.pop();
        })
        .catch(err => {
          this.apiResponsesLoderFlag.pop();
        });
   // }
  }

  setValidation() {
    this.validatorOptions = {
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        ledger_name: {
          group: '.ledger_name',
          validators: {
            notEmpty: {
              message: 'Ledger name is required.'
            },
            stringLength: {
              min: 4,
              max: 50,
              message: 'Ledger name must be between 4-50 characters.'
            }
          },
        },
        company_id: {
          group: '.company_id',
          validators: {
            notEmpty: {
              message: 'Please select company.'
            }
          },
        },
        status: {
          group: '.status_id',
          validators: {
            notEmpty: {
              message: 'Please select status.'
            }
          },
        },
        group_type: {
          group: '.group_type',
          validators: {
            notEmpty: {
              message: 'Please select group type.'
            }
          },
        },
        BudgetLedger: {
          group: '.budget_ledger_id',
          validators: {
            notEmpty: {
              message: 'Please select budget ledger.'
            }
          },
        },
        LedgerType: {
          group: '.ledgerType',
          validators: {
            notEmpty: {
              message: 'Please select ledger type.'
            }
          },
        }
      }
    }
  }
}