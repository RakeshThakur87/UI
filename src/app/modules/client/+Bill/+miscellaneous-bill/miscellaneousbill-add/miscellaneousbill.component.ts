import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { HttpApiService } from '../../../../../shared/http-api.service';
import { config } from '../../../../../shared/constant';
import { parse } from 'querystring';
import Swal from 'sweetalert2';

@Component({
    providers: [HttpApiService],
    selector: 'app-miscellaneous-bill',
    templateUrl: './miscellaneousbill.html',
    styleUrls: ['./miscellaneousbill.css']
})
export class MiscellaneousBillCreationComponent implements OnInit {
    public user = localStorage.getItem('user');
    public session: string = "";
    public productOrderBillCreation: any = {};
    public gridErrorMessage: string = "";
    public errorMessage: string = "";
    public itemRows = [];
    public total_amount: string = "";
    public itemRowsCount = 0;
    public itemsDetails: any = [];
    public serialNumber: string = "";
    public totalAmountInWords: string = "";
    public amountLimitError: string = "";
    public totalPayableAmountOfAllItems: string = "";
    public totalExpensesAmount = 0;
    public totalInvoiceAmount: string = "";
    public isAdd: boolean = true;
    public branchDetails: any = [];
    public receiverDetails: any = {};
    public vendorDetails: any = {};
    public currendate: any = {};
    public apiResponsesLoderFlag = [];
    //dtOptions: DataTables.Settings = {};
    public sessionList: any = [];
    public branchList: any = [];
    public vendorList: any = [];
    public projectList: any = [];
    public employeeList: any = [];
    public poTypeList: any = [];
    public poDepartmentList: any = [];
    public statesList: any = [];
    public productList: any = [];
    public companyList: any = [];
    public chapterList: any = [];
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.session = "2017-2018";
        let date = new Date();

        this.currendate = new Date();

        this.productOrderBillCreation["JobStartDate"] = new Date();
        this.productOrderBillCreation['POType'] = "";
        this.productOrderBillCreation['ServiceType'] = "";
        this.productOrderBillCreation['SupplierId'] = "";
        this.productOrderBillCreation['BranchId'] = "";
        this.productOrderBillCreation['hsnListArray'] = [];
        this.productOrderBillCreation['productitemListArray'] = [];
        this.productOrderBillCreation['qtyListArray'] = [];
        this.productOrderBillCreation['qtyUnitListArray'] = [];
        this.productOrderBillCreation['qtycodeListArray'] = [];
        this.productOrderBillCreation['valueperunitListArray'] = [];
        this.productOrderBillCreation['totalvaluelistarr'] = [];
        this.productOrderBillCreation['discountlistarr'] = [];
        this.productOrderBillCreation['rateListArray'] = [];
        this.productOrderBillCreation['taxableAmountListArray'] = [];
        this.productOrderBillCreation['igstRateListArray'] = [];
        this.productOrderBillCreation['igstAmountListArray'] = [];
        this.productOrderBillCreation['cgstRateListArray'] = [];
        this.productOrderBillCreation['cgstAmountListArray'] = [];
        this.productOrderBillCreation['sgstRateListArray'] = [];
        this.productOrderBillCreation['sgstAmountListArray'] = [];
        this.productOrderBillCreation['JobContractNo'] = [];
        this.productOrderBillCreation['ProductDescription'] = [];
        this.productOrderBillCreation["total_igst"] = 0;
        this.productOrderBillCreation["total_sgst"] = 0;
        this.productOrderBillCreation["total_cgst"] = 0;


        this.clearreceiverdetail();
        this.clearshippeddetail();

        this.sessionList = [{ "session_uuid": 1, "session_name": "2018-2019" }];


        this.poTypeList = [{ "Id": 6, "Name": "2A" }, { "Id": 7, "Name": "2B" }, { "Id": 8, "Name": "2C" }, { "Id": 9, "Name": "2T" }, { "Id": 10, "Name": "2R" }, { "Id": 11, "Name": "OJ" }, { "Id": 12, "Name": "ON" }];
        this.poDepartmentList = [{ "Id": 1, "Name": "HR" }, { "Id": 2, "Name": "NE" }, { "Id": 3, "Name": "MOD" }, { "Id": 4, "Name": "HK" }, { "Id": 5, "Name": "Service" }];

        this.chapterList = [{ "chapter_type_uuid": 1, "chapter_type_name": "HSN" }];
        this.statesList = [{ "state_name": "Haryana" }, { "state_name": "Mumbai" }];

        this.productOrderBillCreation["session"] = 1;
        this.productOrderBillCreation["BranchId"] = "";
        this.productOrderBillCreation["bill_type"] = 1;
        this.productOrderBillCreation["ProjectId"] = "";
        this.productOrderBillCreation["SupplierId"] = "";
        this.productOrderBillCreation["SuppervisorId"] = "";




        this.branchDetails["address"] = "sector-10 panchkula";
        this.branchDetails["gst"] = "55ggv77e"



    }

    ngOnInit() {
        this.product();
        this.SupplierList();
        this.CompanyList();
        if (this.isAdd) {
            this.addItemRow(this.itemRowsCount, false);
        }
    }

    backTOPartyDetails() {
        this.router.navigate(['/report/partywisedetail'], { queryParams: { res: 'partydetails' } })
    }

    product() {
        let url = 'product/GetProductList'
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.get(url).then(res => {
            this.productList = res;
            this.apiResponsesLoderFlag.pop();
        },
            err => {
                this.apiResponsesLoderFlag.pop();
            });
    }

    SupplierList() {
        this.companyList = [];
        this.productOrderBillCreation["SupplierId"] = "";
        let url = 'business/GetSupplierList'
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.get(url).then(res => {
            debugger;
            this.companyList = res;
            this.apiResponsesLoderFlag.pop();
        },
            err => {
                this.apiResponsesLoderFlag.pop();
            });

        // this.companyList = [{ "Id": "1", "Name": "Test" }]
    }

    SupplierBranchList(SupplierId) {
        this.branchList = [];
        if (SupplierId) {
            let url = "business/GetCompanyWiseBranch/" + SupplierId;
            this.apiResponsesLoderFlag.push(true);
            this.httpApiService.get(url).then(res => {
                debugger
                this.branchList = res;
                this.apiResponsesLoderFlag.pop();
            },
                err => {
                    this.apiResponsesLoderFlag.pop();
                });
        }
    }
    onReceiverChange(id) {

        debugger;
        this.clearreceiverdetail();
        if (id) {
            let supplierdetail = this.branchList.find(x => x.Id == id);
            this.receiverDetails["name"] = supplierdetail.Name;
            this.receiverDetails["address"] = supplierdetail.FullAddress;
            this.receiverDetails["state_name"] = supplierdetail.StateName;
            this.receiverDetails["state_code"] = supplierdetail.ZipCode;
            this.receiverDetails["gst"] = supplierdetail.GSTNO;
            this.receiverDetails["BranchStateID"] = supplierdetail.BranchStateID;
        }
        this.BranchProjectList(id);
        this.BranchEmployeeList(id);
    }

    CompanyList() {
        this.vendorList = [];
        var CompanyId = 2;
        let url = "business/GetBusniessList/" + CompanyId;
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.get(url).then(res => {
            debugger;
            this.vendorList = res;
            let supplierdetail = this.vendorList[0];
            debugger;
            this.vendorDetails["Name"] = supplierdetail.Name;
            this.vendorDetails["Code"] = supplierdetail.Code;
            this.vendorDetails["FullAddress"] = supplierdetail.FullAddress;
            this.vendorDetails["City_Name"] = supplierdetail.City_Name;
            this.vendorDetails["StateName"] = supplierdetail.StateName;
            this.vendorDetails["ZipCode"] = supplierdetail.ZipCode;
            this.vendorDetails["GSTNO"] = supplierdetail.GSTNO;
            this.vendorDetails["PANNo"] = supplierdetail.PANNo;
            this.vendorDetails["CompanyStateID"] = supplierdetail.CompanyStateID;

            this.apiResponsesLoderFlag.pop();
        },
            err => {
                this.apiResponsesLoderFlag.pop();
            });
    }

    clearreceiverdetail() {
        this.receiverDetails["name"] = ""
        this.receiverDetails["address"] = "";
        this.receiverDetails["state_name"] = ""
        this.receiverDetails["state_code"] = "";
        this.receiverDetails["gst"] = "";
    }

    clearshippeddetail() {
        this.productOrderBillCreation["consignee_name"] = "";
        this.productOrderBillCreation["consignee_address"] = "";
        this.productOrderBillCreation["consignee_state"] = "";
        this.productOrderBillCreation["consignee_code"] = "";
        this.productOrderBillCreation["consignee_gstin"] = "";
    }

    BranchProjectList(BranchId) {
        this.productOrderBillCreation["ProjectId"] = "";
        this.projectList = [];
        let url = "Project/GetProjectBranchWise/" + BranchId;
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.get(url).then(res => {

            this.projectList = res;
            this.apiResponsesLoderFlag.pop();
        },
            err => {
                this.apiResponsesLoderFlag.pop();
            });
    }

    BranchEmployeeList(BranchId) {

        this.projectList = [];
        let url = "EmployeeDetail/GetEmployeeListBranchWise/" + BranchId;
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.get(url).then(res => {

            this.employeeList = res;
            this.apiResponsesLoderFlag.pop();
        },
            err => {
                this.apiResponsesLoderFlag.pop();
            });
    }

    getState() {
        if (this.statesList.length <= 0) {
            let url = 'states/getstatesforcountry/' + ""// config.COUNTRY_INDIA_UUID;
            this.apiResponsesLoderFlag.push(true);
            this.httpApiService.get(url).then(res => {
                this.statesList = res;
                this.apiResponsesLoderFlag.pop();
            },
                err => {
                    this.apiResponsesLoderFlag.pop();
                });
        }
    }
    onsiteChange(id) {
        debugger;
        this.clearshippeddetail();
        if (id) {
            let shippeddetail = this.projectList.find(x => x.Id == id);

            this.productOrderBillCreation["consignee_name"] = shippeddetail.Name;
            this.productOrderBillCreation["consignee_address"] = shippeddetail.FullAddress;;
            this.productOrderBillCreation["consignee_state"] = shippeddetail.StateName;;
            this.productOrderBillCreation["consignee_code"] = shippeddetail.ZipCode;;
            this.productOrderBillCreation["consignee_gstin"] = shippeddetail.Code;;
        }
    }

    /**************Clear Array*****************/
    clearGridArray() {

        this.productOrderBillCreation['hsnListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['productitemListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['qtyListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['qtyUnitListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['qtycodeListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['valueperunitListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['totalvaluelistarr'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['discountlistarr'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['rateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['taxableAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['igstRateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['igstAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['cgstRateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['cgstAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['sgstRateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['sgstAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['JobContractNo'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['ProductDescription'][this.itemRowsCount] = 0;
    }

    initializeInvoiceObject() {

        // this.receiverDetails = {};
        // this.totalPayableAmountOfAllItems = 0;
        // this.totalExpensesAmount = 0;
        // this.totalAmountInWords = "";
        // this.totalInvoiceAmount = 0;
        // this.errorMessage = "";

        // this.pageUuid = "";


        this.productOrderBillCreation['hsnListArray'] = [];
        this.productOrderBillCreation['productitemListArray'] = [];

        this.productOrderBillCreation['qtyListArray'] = [];
        this.productOrderBillCreation['qtyUnitListArray'] = [];
        this.productOrderBillCreation['qtycodeListArray'] = [];
        this.productOrderBillCreation['valueperunitListArray'] = [];
        this.productOrderBillCreation['totalvaluelistarr'] = [];
        this.productOrderBillCreation['discountlistarr'] = [];
        this.productOrderBillCreation['rateListArray'] = [];
        this.productOrderBillCreation['taxableAmountListArray'] = [];
        this.productOrderBillCreation['igstRateListArray'] = [];
        this.productOrderBillCreation['igstAmountListArray'] = [];
        this.productOrderBillCreation['cgstRateListArray'] = [];
        this.productOrderBillCreation['cgstAmountListArray'] = [];
        this.productOrderBillCreation['sgstRateListArray'] = [];
        this.productOrderBillCreation['sgstAmountListArray'] = [];
        this.productOrderBillCreation['JobContractNo'] = [];
        this.productOrderBillCreation['ProductDescription'] = [];
        this.productOrderBillCreation['is_bill_subject_to_reverse_charges'] = false;
        this.productOrderBillCreation['vehicle_number'] = "";

        // this.itemsDetails = [];
        this.productOrderBillCreation['branch_invoice_reference_prefix'] = "";
        this.itemRows = [];
        this.itemRowsCount = 0;

    }

    initializeObjectForUpdate(invoiceDetails?) {
        debugger;
        this.product();
        if (invoiceDetails) {

            this.getState();
            this.initializeInvoiceObject();
            this.productOrderBillCreation['SupplierId'] = invoiceDetails.invoice_header_info.SupplierId;
            this.productOrderBillCreation['BranchId'] = invoiceDetails.invoice_header_info.BranchId;


            this.serialNumber = invoiceDetails.invoice_header_info.invoice_prefix;

            this.productOrderBillCreation['bill_type'] = invoiceDetails.invoice_header_info.chapter_type_uuid;
            this.productOrderBillCreation['branch_invoice_reference_prefix'] = invoiceDetails.invoice_header_info.branch_invoice_reference_prefix_uuid;



            this.productOrderBillCreation['consignee_gstin'] = invoiceDetails.invoice_header_info.consignee_gstin;
            this.productOrderBillCreation['is_bill_subject_to_reverse_charges'] = invoiceDetails.invoice_header_info.is_bill_subject_to_reverse_charges;


            this.session = invoiceDetails.invoice_header_info.session_uuid;

            this.productOrderBillCreation['advance_reference_number'] = invoiceDetails.invoice_header_info.advance_reference_number;
            this.productOrderBillCreation['reference_number'] = invoiceDetails.invoice_header_info.reference_number;

            // jQuery('#deliveryDate').val(delivery_time[0].trim());
            // jQuery('#deliveryTime').val(delivery_time[1].trim());
            this.productOrderBillCreation['vehicle_number'] = invoiceDetails.invoice_header_info.vehicle_number;


            this.totalAmountInWords = invoiceDetails.invoice_header_info.invoice_amount_words;
            this.totalPayableAmountOfAllItems = invoiceDetails.invoice_header_info.total_amount;
            this.totalExpensesAmount = invoiceDetails.invoice_header_info.total_expense;
            this.totalInvoiceAmount = invoiceDetails.invoice_header_info.invoice_amount;

            this.itemRowsCount = 0;
            this.itemsDetails = [];
            for (let key in invoiceDetails.invoice_details as any[]) {
                this.itemRows[this.itemRowsCount] = { "ID": this.itemRowsCount };
                this.itemRowsCount++;
                this.itemsDetails[key] = {
                    "product_uuid": invoiceDetails.invoice_details[key].product_uuid,
                    "product_percentage": invoiceDetails.invoice_details[key].product_percentage,
                    "product_percentage_uuid": invoiceDetails.invoice_details[key].product_percentage_uuid
                }
                this.productOrderBillCreation['hsnListArray'][key] = invoiceDetails.invoice_details[key].product_code;
                this.productOrderBillCreation['itemDesListArray'][key] = invoiceDetails.invoice_details[key].product_item_uuid;


                this.productOrderBillCreation['qtyListArray'][key] = ""//this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].quantity, this.decimalSteps);
                this.productOrderBillCreation['qtyUnitListArray'][key] = invoiceDetails.invoice_details[key].quantity_unit;
                this.productOrderBillCreation['rateListArray'][key] = ""//this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].rate_per_quantity, this.decimalSteps);
                this.productOrderBillCreation['discountListArray'][key] = ""// this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].discount, this.decimalSteps);

                this.productOrderBillCreation['totalItemPriceListArray'][key] = ""// this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].total_value, this.decimalSteps);
                this.productOrderBillCreation['taxableAmountListArray'][key] = ""// this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].taxable_value, this.decimalSteps);


                this.productOrderBillCreation['igstAmountListArray'][key] = ""// this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].igst, this.decimalSteps);
                //   invoiceDetails.invoice_details[key].igst, this.decimalSteps);

                this.productOrderBillCreation['cgstAmountListArray'][key] = ""// this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].cgst_value, this.decimalSteps);
                this.productOrderBillCreation['cgstOrUgstAmountListArray'][key] = ""//this.utility.getFormatedFloat(invoiceDetails.invoice_details[key].sgst_ugst_value, this.decimalSteps);
                //+ invoiceDetails.invoice_details[key].cgst_value + invoiceDetails.invoice_details[key].sgst_ugst_value, this.decimalSteps);

            }

            // this.getExpensesDetails(invoiceDetails.invoice_expenses_info);
        }
        //this.resetErrors();
    }

    addItemRow(itemIndex, isFromGrid) {
        this.gridErrorMessage = "";
        if (!isFromGrid) {
            this.clearGridArray();
            this.initializeItemRow(itemIndex);
        } else {
            this.clearGridArray();
            this.initializeItemRow(itemIndex + 1);

        }
    }

    initializeItemRow(itemIndex) {
        this.itemRows[this.itemRowsCount] = { "ID": this.itemRowsCount };
        this.itemRowsCount++;
    }

    removeItemRow(removeIndex) {
        let rows = this.itemRows;
        this.itemRows = [];
        this.itemRowsCount = 0;
        for (let key in rows) {
            if (removeIndex != key) {
                this.itemRows[this.itemRowsCount] = { "ID": this.itemRowsCount };
                this.itemRowsCount++;
            }

        }

        this.productOrderBillCreation['hsnListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['productitemListArray'].splice(removeIndex, 1);

        this.productOrderBillCreation['qtyListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['qtyUnitListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['qtycodeListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['valueperunitListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['totalvaluelistarr'].splice(removeIndex, 1);
        this.productOrderBillCreation['discountlistarr'].splice(removeIndex, 1);
        this.productOrderBillCreation['rateListArray'].splice(removeIndex, 1);

        this.productOrderBillCreation['taxableAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['igstRateListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['igstAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['cgstRateListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['cgstAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['sgstRateListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['sgstAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['JobContractNo'].splice(removeIndex, 1);
        this.productOrderBillCreation['ProductDescription'].splice(removeIndex, 1);
        this.itemsDetails.splice(removeIndex, 1);

        this.onvalueChange();
        this.onQtyChange();
        this.onDiscountChange();
    }

    hsnCodeKeyUp(itemIndex) {
        if (this.productOrderBillCreation['hsnListArray'][itemIndex].length == 0) {

        }
    }
    // calculatePrice(itemIndex) {
    //   this.productOrderBillCreation['rateListArray'][itemIndex] =[]// this.utility.getFormatedFloat(this.productOrderBillCreation['rateListArray'][itemIndex], this.decimalSteps);
    //   this.productOrderBillCreation['discountListArray'][itemIndex] =[]// this.utility.getFormatedFloat(this.productOrderBillCreation['discountListArray'][itemIndex], this.decimalSteps);
    //   let qty = this.productOrderBillCreation['qtyListArray'][itemIndex];
    //   if (isNaN(Number(qty))) {
    //     qty = 0;
    //   }
    //   let rate = this.productOrderBillCreation['rateListArray'][itemIndex];
    //   if (isNaN(Number(rate))) {
    //     rate = 0;
    //   }
    //   this.productOrderBillCreation['totalItemPriceListArray'][itemIndex] = rate * qty;
    //   this.calculateTaxs(itemIndex);
    //   this.calculateExpences();
    // }

    onQtyChange() {
        debugger;
        let totalqty = 0;

        for (let key in this.productOrderBillCreation['qtyListArray']) {
            totalqty = totalqty + parseFloat(this.productOrderBillCreation['qtyListArray'][key])
        }
        this.productOrderBillCreation["total_qty"] = totalqty;

        // this.enableSubmitButtons();
        this.gridErrorMessage = "";
        this.errorMessage = "";
        // this.calculatePrice(itemIndex);
        // this.calculateTaxs(itemIndex);
        // this.calculateExpences();
        this.taxablecalculationdetail();
    }

    onvalueChange() {
        debugger;
        let totalvalue = 0;
        for (let key in this.productOrderBillCreation['valueperunitListArray']) {
            totalvalue = totalvalue + parseFloat(this.productOrderBillCreation['valueperunitListArray'][key])
        }
        this.productOrderBillCreation["total_value_unit"] = totalvalue;
        this.taxablecalculationdetail();
    }

    onDiscountChange() {
        let totaldiscount = 0;
        for (let key in this.productOrderBillCreation['discountlistarr']) {
            totaldiscount = totaldiscount + parseFloat(this.productOrderBillCreation['discountlistarr'][key])
        }
        this.productOrderBillCreation["total_discount"] = totaldiscount;
        this.taxablecalculationdetail();
    }

    oncgstdiscountChange() {
        let totalcgstdiscount = 0;
        for (let key in this.productOrderBillCreation['cgstAmountListArray']) {
            totalcgstdiscount = totalcgstdiscount + parseFloat(this.productOrderBillCreation['cgstAmountListArray'][key])
        }
        this.productOrderBillCreation["total_cgst"] = totalcgstdiscount;
        this.taxcalculation();
    }

    onsgstdiscountChange() {
        let totalsgstdiscount = 0;
        for (let key in this.productOrderBillCreation['cgstAmountListArray']) {
            totalsgstdiscount = totalsgstdiscount + parseFloat(this.productOrderBillCreation['cgstAmountListArray'][key])
        }
        this.productOrderBillCreation["total_sgst"] = totalsgstdiscount;
        this.taxcalculation();
    }

    onigstdiscountChange() {
        let totaligstdiscount = 0;
        for (let key in this.productOrderBillCreation['cgstAmountListArray']) {
            totaligstdiscount = totaligstdiscount + parseFloat(this.productOrderBillCreation['igstAmountListArray'][key])
        }
        this.productOrderBillCreation["total_igst"] = totaligstdiscount;
        this.taxcalculation();
    }

    taxcalculation() {
        this.productOrderBillCreation["TaxAmount"] = parseFloat(this.productOrderBillCreation["total_sgst"]) + parseFloat(this.productOrderBillCreation["total_sgst"]) +
            parseFloat(this.productOrderBillCreation["total_igst"])

        //    this.productOrderBillCreation["taxableAmount"]=0

    }
    taxablecalculationdetail() {
        debugger;
        this.productOrderBillCreation["taxableAmount"] = 0;
        this.productOrderBillCreation["totalcgst"] = 0;
        this.productOrderBillCreation["totalsgst"] = 0;
        this.productOrderBillCreation["totaligst"] = 0;

        let totaltaxvalue = 0;
        for (let key in this.itemRows) {
            let totalamountwithoutdiscount: number = 0;
            let totalamountigst: number = 0;
            let totalamountcgst: number = 0;
            let totalamountsgst: number = 0;
            debugger;
            // this.productOrderBillCreation['taxableAmountListArray'][key] =
            if (parseFloat(this.productOrderBillCreation['qtyListArray'][key]) > 0) {
                totalamountwithoutdiscount = ((parseFloat(this.productOrderBillCreation['valueperunitListArray'][key]) * parseFloat(this.productOrderBillCreation['qtyListArray'][key])));
            }
            else {
                totalamountwithoutdiscount = parseFloat(this.productOrderBillCreation['valueperunitListArray'][key])
            }
            this.productOrderBillCreation['taxableAmountListArray'][key] = totalamountwithoutdiscount;
            debugger

            let cgstdiscount_amount: number = 0;

            if (parseFloat(this.productOrderBillCreation['cgstAmountListArray'][key]) > 0) {
                cgstdiscount_amount = totalamountwithoutdiscount * parseFloat(this.productOrderBillCreation['cgstAmountListArray'][key]) / 100
                totalamountcgst = cgstdiscount_amount;
                this.productOrderBillCreation["totalcgst"] = totalamountcgst + this.productOrderBillCreation["totalcgst"];
            }
            let sgstdiscount_amount: number = 0;
            if (parseFloat(this.productOrderBillCreation['sgstAmountListArray'][key]) > 0) {
                sgstdiscount_amount = totalamountwithoutdiscount * parseFloat(this.productOrderBillCreation['sgstAmountListArray'][key]) / 100
                totalamountsgst = sgstdiscount_amount;
                this.productOrderBillCreation["totalsgst"] = totalamountsgst + this.productOrderBillCreation["totalsgst"];

            }
            let igstdiscount_amount: number = 0;
            if (parseFloat(this.productOrderBillCreation['igstAmountListArray'][key]) > 0) {
                igstdiscount_amount = totalamountwithoutdiscount * parseFloat(this.productOrderBillCreation['igstAmountListArray'][key]) / 100
                totalamountigst = igstdiscount_amount;
                this.productOrderBillCreation["totaligst"] = totalamountigst + this.productOrderBillCreation["totaligst"];
            }
            totaltaxvalue = totalamountwithoutdiscount + igstdiscount_amount + sgstdiscount_amount + cgstdiscount_amount + totaltaxvalue;

        }

        //  var converter = require('number-to-words');
        this.productOrderBillCreation["totalAmount"] = this.productOrderBillCreation['taxableAmountListArray'].reduce((sum, item) => sum + item, 0);

        this.productOrderBillCreation["taxableAmount"] = totaltaxvalue
        // this.total_amount = converter.toWords(totaltaxvalue);
    }
    calculateExpences(expensesIndex?) {
        if (expensesIndex >= 0) {
            this.productOrderBillCreation['expensesAmountListArray'][expensesIndex] = ""//this.utility.getFormatedFloat(this.productOrderBillCreation['expensesAmountListArray'][expensesIndex], this.decimalSteps);
        }
        this.totalExpensesAmount = 0;
        for (let entry of this.productOrderBillCreation['expensesAmountListArray']) {
            this.totalExpensesAmount = Number(this.totalExpensesAmount) + Number(entry);
        }
        this.getTotalAmountInWords();
    }

    getTotalAmountInWords() {
        this.amountLimitError = "";
        this.totalInvoiceAmount = this.totalPayableAmountOfAllItems + this.totalExpensesAmount;
        if (!(this.totalInvoiceAmount.toString().indexOf('e') > -1)) {
            // if (this.productOrderBillCreation['bill_against_advance']) {
            //   this.totalInvoiceAmount = this.totalInvoiceAmount - Number(Math.abs(this.advanceBillDetails.total_advance_amount) - Number(Math.abs(this.advanceBillDetails.total_invoice_amount)));
            // }
            this.totalAmountInWords = ""//this.utility.numberToWords(this.totalInvoiceAmount,this.decimalSteps);
        } else {
            this.amountLimitError = "Amount limit exceeded.";
            // this.totalInvoiceAmount = 0;
            // this.totalAmountInWords = "";
        }
    }

    getArraySum(arrayList) {
        let sum = 0;
        if (arrayList != undefined) {
            for (let item of arrayList as any[]) {
                sum = sum + Number(item);
            }
        }
        return ""// this.utility.getFormatedFloat(sum, this.decimalSteps);
    }

    ChangeLedgerDDLDesign() {
        let element = document.getElementById("tree_ledger_div");
        element.setAttribute("style", "display: none");
    }

    ChangeDDLDesign() {
        let element = document.getElementById("tree_main_div");
        element.setAttribute("style", "display: none");
    }

    onSubmit() {
        let url = 'PoHeader/InsertPoHeaderDetail';
        let bodyobj: any = {};
        debugger;
        bodyobj["SupplierId"] = this.productOrderBillCreation["SupplierId"];
        bodyobj["MiscellaneousDate"] = this.productOrderBillCreation["MiscellaneousDate"]
        bodyobj["JobOrderNo"] = this.productOrderBillCreation["JobOrderNo"]
        bodyobj["MiscellaneousNo"] = this.productOrderBillCreation["MiscellaneousNo"]
        bodyobj["CompanyId"] = 2
        bodyobj["MiscellaneousType"] = 1;
        bodyobj["POType"] = this.productOrderBillCreation["POType"]
        bodyobj["PONo"] = this.productOrderBillCreation["PONo"]
        bodyobj["PODate"] = this.productOrderBillCreation["PODate"]
        bodyobj["RequestDate"] = this.productOrderBillCreation["RequestDate"]
        bodyobj["JobStartDate"] = this.productOrderBillCreation["JobStartDate"]
        bodyobj["MiscellaneousNo"] = this.productOrderBillCreation["MiscellaneousNo"]
        bodyobj["ServiceType"] = this.productOrderBillCreation["ServiceType"];
        bodyobj["SuppervisorId"] = this.productOrderBillCreation["SuppervisorId"];
        bodyobj["ProjectId"] = this.productOrderBillCreation["ProjectId"];
        bodyobj["BranchId"] = this.productOrderBillCreation["BranchId"];
        bodyobj["TotalPOAmount"] = this.productOrderBillCreation["total_value_unit"]
        bodyobj["TaxAmount"] = parseFloat(this.productOrderBillCreation["taxableAmount"]) * parseFloat('18') / parseFloat('100')
        bodyobj["TotalBill"] = 0
        bodyobj["GrandTotal"] = this.productOrderBillCreation["taxableAmount"]
        bodyobj["CreatedBy"] = 1

        let arraylist = [];
        for (let key in this.productOrderBillCreation['valueperunitListArray']) {
            let arrayobj = {};
            arrayobj["HSNCode"] = this.productOrderBillCreation['hsnListArray'][key];
            arrayobj["ProductId"] = this.productOrderBillCreation['productitemListArray'][key]
            arrayobj["UOMId"] = this.productOrderBillCreation['qtycodeListArray'][key]
            arrayobj["Qty"] = this.productOrderBillCreation['qtyListArray'][key]
            arrayobj["Rate"] = this.productOrderBillCreation['valueperunitListArray'][key]
            arrayobj["TotalPrice"] = this.productOrderBillCreation['taxableAmountListArray'][key]
            arrayobj["IGST"] = this.productOrderBillCreation['igstAmountListArray'][key]
            arrayobj["CGST"] = this.productOrderBillCreation['cgstAmountListArray'][key]
            arrayobj["SGST"] = this.productOrderBillCreation['sgstAmountListArray'][key]
            arrayobj["JobContractNo"] = this.productOrderBillCreation['JobContractNo'][key]
            arrayobj["ProductDescription"] = this.productOrderBillCreation['ProductDescription'][key]
            arrayobj["GrandTotal"] = parseFloat(this.productOrderBillCreation['taxableAmountListArray'][key]) + (parseFloat(this.productOrderBillCreation['taxableAmountListArray'][key]) * parseFloat(this.productOrderBillCreation['igstAmountListArray'][key]) / 100) + (parseFloat(this.productOrderBillCreation['cgstAmountListArray'][key]) * parseFloat(this.productOrderBillCreation['cgstAmountListArray'][key]) / 100) + (parseFloat(this.productOrderBillCreation['sgstAmountListArray'][key]) * parseFloat(this.productOrderBillCreation['sgstAmountListArray'][key]) / 100)
            arrayobj["ExtraCharges"] = parseFloat(arrayobj["IGST"]) + parseFloat(arrayobj["CGST"]) + parseFloat(arrayobj["SGST"])
            arraylist.push(arrayobj)
        }
        bodyobj["PO_Details"] = arraylist;



        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.post(url, bodyobj).then(res => {
            debugger;
            // if (res) {
            Swal({
                title: 'PO Has Been Created Sucessfully Save',
                // text: 'You will not be able to recover this imaginary file!',
                type: 'warning',//success
                showCancelButton: true,
                confirmButtonText: 'Yes',
                // cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.value) {
                    //localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
                    this.router.navigate(['/bill/po-bill']);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Swal(
                    //   'Cancelled',
                    //   'Your imaginary file is safe :)',
                    //   'error'
                    // )
                }
            })
            //}
            this.apiResponsesLoderFlag.pop();
        },
            err => {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: '<a>Please Try Again Latter On Or Contact Own Application Administrator</a>'
                })
                this.apiResponsesLoderFlag.pop();
            });

    }

    onProductChange(productid, index) {
        let data = this.productList.find(x => x.Id == productid);
        for (let key in this.itemRows) {
            for (let key in this.itemRows)
                if (key == index) {

                    this.productOrderBillCreation.hsnListArray[key] = data.product_item_code;
                    if (this.vendorDetails["CompanyStateID"] == this.receiverDetails["BranchStateID"]) {
                        this.productOrderBillCreation.cgstAmountListArray[key] = data.product_gst_tax / 2;
                        this.productOrderBillCreation.sgstAmountListArray[key] = data.product_gst_tax / 2;
                        this.productOrderBillCreation.igstAmountListArray[key] = 0;
                    }
                    else {
                        this.productOrderBillCreation.igstAmountListArray[key] = data.product_gst_tax;
                        this.productOrderBillCreation.cgstAmountListArray[key] = 0;
                        this.productOrderBillCreation.sgstAmountListArray[key] = 0;
                    }
                    this.taxablecalculationdetail();
                }
        }
    }


}