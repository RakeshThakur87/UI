import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { HttpApiService } from '../../../../shared/http-api.service';
import { config } from '../../../../shared/constant';
import { parse } from 'querystring';
import Swal from 'sweetalert2';
@Component({
    providers: [HttpApiService],
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.css']
})

export class InvoiceComponent implements OnInit {
    public user = localStorage.getItem('user');
    private session: string = "";
    display: string = 'none';
    private productOrderBillCreation: any = {};
    private productdetaillist: any = [];
    private gridErrorMessage: string = "";
    private errorMessage: string = "";
    private itemRows = [];
    private total_amount: string = "";
    private itemRowsCount = 0;
    private itemsDetails: any = [];
    private serialNumber: string = "";
    private totalAmountInWords: string = "";
    private totalPayableAmountOfAllItems: string = "";
    private totalExpensesAmount: string = "";
    private totalInvoiceAmount: string = "";
    private isAdd: boolean = true;
    private branchDetails: any = [];
    private receiverDetails: any = {};
    private vendorDetails: any = {};
    private currendate: any = {};
    public apiResponsesLoderFlag = [];
    //dtOptions: DataTables.Settings = {};
    private sessionList: any = [];
    private branchList: any = [];
    private vendorList: any = [];
    private projectList: any = [];
    private employeeList: any = [];
    private poTypeList: any = [];
    private poDepartmentList: any = [];
    private productList: any = [];
    private companyList: any = [];
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;
    private bill_po_list = JSON.parse(localStorage.getItem('bill_po_list'));

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.session = "2017-2018";
        let date = new Date();
        let curruntYear = date.getFullYear();
        let sessionValues = this.session.split('-');
        this.currendate = new Date();
        this.productOrderBillCreation["InvoiceDate"] = new Date();
        this.productOrderBillCreation['SupplierId'] = "";
        this.productOrderBillCreation['BranchId'] = "";
        this.productOrderBillCreation['hsnListArray'] = [];
        this.productOrderBillCreation['productitemListArray'] = [];
        this.productOrderBillCreation['PODetailsIdListArray'] = [];
        this.productOrderBillCreation['ProductNameArray'] = [];
        this.productOrderBillCreation['ProductDescriptionArray'] = [];
        this.productOrderBillCreation['qtyListArray'] = [];
        this.productOrderBillCreation['qtyUnitListArray'] = [];
        this.productOrderBillCreation['qtycodeListArray'] = [];
        this.productOrderBillCreation['valueperunitListArray'] = [];
        this.productOrderBillCreation['InvoiceAmountListArray'] = [];
        this.productOrderBillCreation['balanceAmountListArray'] = [];
        this.productOrderBillCreation['disInvoiceAmountListArray'] = [];
        this.productOrderBillCreation['totalvaluelistarr'] = [];
        this.productOrderBillCreation['discountlistarr'] = [];
        this.productOrderBillCreation['taxableAmountListArray'] = [];
        this.productOrderBillCreation['igstRateListArray'] = [];
        this.productOrderBillCreation['igstAmountListArray'] = [];
        this.productOrderBillCreation['cgstRateListArray'] = [];
        this.productOrderBillCreation['cgstAmountListArray'] = [];
        this.productOrderBillCreation['sgstRateListArray'] = [];
        this.productOrderBillCreation['sgstAmountListArray'] = [];
        this.productOrderBillCreation['cgstOrUgstAmountListArray'] = [];
        this.productOrderBillCreation["total_igst"] = 0;
        this.productOrderBillCreation["total_sgst"] = 0;
        this.productOrderBillCreation["total_cgst"] = 0;
        this.clearshippeddetail();
        this.productOrderBillCreation["session"] = 1;
        this.productOrderBillCreation["BranchId"] = "";
        this.productOrderBillCreation["bill_type"] = 1;
        this.productOrderBillCreation["ProjectId"] = "";
        this.productOrderBillCreation["SupplierId"] = "";
        this.productOrderBillCreation['total_qty'] = 0;
        this.productOrderBillCreation["total_value_unit"] = 0;
        this.productOrderBillCreation["total_balance_amount"] = 0;
        this.productOrderBillCreation["total_discount_invoice_amount"] = 0;
        this.productOrderBillCreation["invoice_per"] = 0;
        this.productOrderBillCreation["total_invoice_amount"] = 0;
        this.productOrderBillCreation["total_invoice_diff_amount"] = 0;
        this.productOrderBillCreation["totalcgst"] = 0
        this.productOrderBillCreation["totalsgst"] = 0
        this.productOrderBillCreation["totaligst"] = 0
    }

    ngOnInit() {
        this.product();
        if (this.isAdd) {
            this.addItemRow(this.itemRowsCount, false);
        }
        this.productList = [];
        if (this.bill_po_list != undefined || this.bill_po_list.length > 0) {
            this.CompanyList(this.bill_po_list[0].POHeaderId);
            let poobj = {};
            poobj["POID"] = 0;
            poobj["ProductIdlist"] = [];
            for (let key in this.bill_po_list) {
                if (poobj["POID"] == 0) {
                    poobj["POID"] = this.bill_po_list[key].POHeaderId;
                    poobj["ProductIdlist"].push(this.bill_po_list[key].ProductId)
                }
                else {
                    poobj["ProductIdlist"].push(this.bill_po_list[key].ProductId)
                }
            }
            let url = "/Invoice/Get_Invoice_Product_Details";
            this.apiResponsesLoderFlag.push(true);
            this.httpApiService.post(url, poobj).then(res => {

                if (res) {

                    this.productdetaillist = res;
                    this.editdetail()
                }
                this.apiResponsesLoderFlag.pop();
            },
                err => {
                    this.apiResponsesLoderFlag.pop();
                });
        }
    }
    editdetail() {
        this.itemRowsCount = 0;
        this.initializeInvoiceObject();
        debugger;
        this.productOrderBillCreation["totalcgst"] = 0;
        this.productOrderBillCreation["totalsgst"] = 0
        this.productOrderBillCreation["totaligst"] = 0
        for (let key in this.productdetaillist as any[]) {
            this.itemRows[this.itemRowsCount] = { "ID": this.itemRowsCount };
            this.itemRowsCount++;
            this.productOrderBillCreation['hsnListArray'][key] = this.productdetaillist[key].HSNCode;
            this.productOrderBillCreation['productitemListArray'][key] = this.productdetaillist[key].ProductId;
            this.productOrderBillCreation['PODetailsIdListArray'][key] = this.productdetaillist[key].ID;
            this.productOrderBillCreation['ProductNameArray'][key] = this.productdetaillist[key].ProductName;
            this.productOrderBillCreation['ProductDescriptionArray'][key] = this.productdetaillist[key].ProductDescription;
            this.productOrderBillCreation['qtyListArray'][key] = this.productdetaillist[key].Qty;
            this.productOrderBillCreation['qtycodeListArray'][key] = this.productdetaillist[key].UOM
            this.productOrderBillCreation['valueperunitListArray'][key] = this.productdetaillist[key].Rate;
            this.productOrderBillCreation['InvoiceAmountListArray'][key] = this.productdetaillist[key].InvoiceAmount;
            this.productOrderBillCreation['balanceAmountListArray'][key] = this.productOrderBillCreation['valueperunitListArray'][key] - this.productOrderBillCreation['InvoiceAmountListArray'][key];
            this.productOrderBillCreation['disInvoiceAmountListArray'][key] = 0;
            this.productOrderBillCreation['discountlistarr'][key] = 0;
            if (this.vendorDetails["CompanyStateName"] == this.receiverDetails["BranchStateName"]) {
                this.productOrderBillCreation.cgstAmountListArray[key] = this.productdetaillist[key].product_gst_tax / 2;
                this.productOrderBillCreation.sgstAmountListArray[key] = this.productdetaillist[key].product_gst_tax / 2;
                this.productOrderBillCreation.igstAmountListArray[key] = 0;
            }
            else {
                this.productOrderBillCreation.igstAmountListArray[key] = this.productdetaillist[key].product_gst_tax;
                this.productOrderBillCreation.cgstAmountListArray[key] = 0;
                this.productOrderBillCreation.sgstAmountListArray[key] = 0;

            }
        }
        this.productOrderBillCreation['total_qty'] = this.getArraySum(this.productOrderBillCreation['qtyListArray']);
        this.productOrderBillCreation["total_value_unit"] = this.getArraySum(this.productOrderBillCreation['valueperunitListArray']);
        this.productOrderBillCreation["total_balance_amount"] = this.getArraySum(this.productOrderBillCreation['balanceAmountListArray']);
        this.productOrderBillCreation["total_invoice_diff_amount"] = this.getArraySum(this.productOrderBillCreation['InvoiceAmountListArray']);
    }
    backToInvoiceDetails() {
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

    CompanyList(POHeaderId) {
        this.vendorList = [];
        var Id = POHeaderId;
        let url = "Invoice/Get_Invoice_Header_Details/" + Id;
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.get(url).then(res => {
            if (res.length > 0) {
                this.vendorList = res;
                let BillDetails = this.vendorList[0];
                this.vendorDetails["JobOrderNo"] = BillDetails.JobOrderNo;
                this.vendorDetails["PODate"] = BillDetails.PODate;
                this.vendorDetails["PONo"] = BillDetails.PONo;
                this.vendorDetails["ServiceType"] = BillDetails.ServiceType;
                this.vendorDetails["ServiceTypeName"] = BillDetails.ServiceTypeName;
                this.vendorDetails["POTypeName"] = BillDetails.POTypeName;
                this.vendorDetails["GrandTotal"] = BillDetails.GrandTotal;
                this.vendorDetails["BranchName"] = BillDetails.BranchName;
                this.vendorDetails["SupplierName"] = BillDetails.SupplierName;
                this.vendorDetails["CompanyName"] = BillDetails.CompanyName;
                this.vendorDetails["CompanyCode"] = BillDetails.CompanyCode;
                this.vendorDetails["InvoiceNo"] = BillDetails.InvoiceNo;
                this.productOrderBillCreation["SuppervisorId"] = BillDetails.SuppervisorId
                this.vendorDetails["CompanyAddress"] = BillDetails.CompanyAddress;
                this.vendorDetails["CompanyStateName"] = BillDetails.CompanyStateName;
                this.vendorDetails["CompanyCityName"] = BillDetails.CompanyCityName;
                this.vendorDetails["CompanyZipCode"] = BillDetails.CompanyZipCode;
                this.vendorDetails["CompanyMobileNo"] = BillDetails.CompanyMobileNo;
                this.vendorDetails["CompanyEmail"] = BillDetails.CompanyEmail;
                this.vendorDetails["CompanyGSTNo"] = BillDetails.CompanyGSTNo;
                this.vendorDetails["BranchAddress"] = BillDetails.BranchAddress;
                this.vendorDetails["CompanyStateID"] = BillDetails.CompanyStateID;
                this.vendorDetails["BranchStateName"] = BillDetails.BranchStateName;
                this.vendorDetails["BranchCityName"] = BillDetails.BranchCityName;
                this.vendorDetails["BranchZipCode"] = BillDetails.BranchZipCode;
                this.vendorDetails["BranchMobileNo"] = BillDetails.BranchMobileNo;
                this.vendorDetails["BranchEmail"] = BillDetails.BranchEmail;
                this.vendorDetails["BranchGSTNo"] = BillDetails.BranchGSTNo;
                this.vendorDetails["ProjectName"] = BillDetails.ProjectName;
                this.vendorDetails["ProjectAddress"] = BillDetails.ProjectAddress;
                this.vendorDetails["BranchStateID"] = BillDetails.BranchStateID;
                this.vendorDetails["ProjectStateName"] = BillDetails.ProjectStateName;
                this.vendorDetails["ProjectCityName"] = BillDetails.ProjectCityName;
                this.vendorDetails["ProjectZipCode"] = BillDetails.ProjectZipCode;
                this.vendorDetails["ProjectMobileNo"] = BillDetails.ProjectMobileNo;
                this.BranchEmployeeList(BillDetails.BranchId);
            }
            this.apiResponsesLoderFlag.pop();
        },
            err => {
                this.apiResponsesLoderFlag.pop();
            });
    }

    clearshippeddetail() {
        this.productOrderBillCreation["consignee_name"] = "";
        this.productOrderBillCreation["consignee_address"] = "";
        this.productOrderBillCreation["consignee_state"] = "";
        this.productOrderBillCreation["consignee_code"] = "";
        this.productOrderBillCreation["consignee_gstin"] = "";
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

    /**************Clear Array*****************/
    clearGridArray() {
        this.productOrderBillCreation['hsnListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['productitemListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['PODetailsIdListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['ProductNameArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['ProductDescriptionArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['qtyListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['qtyUnitListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['qtycodeListArray'][this.itemRowsCount] = "";
        this.productOrderBillCreation['valueperunitListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['totalvaluelistarr'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['discountlistarr'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['taxableAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['igstRateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['igstAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['cgstRateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['cgstAmountListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['sgstRateListArray'][this.itemRowsCount] = 0;
        this.productOrderBillCreation['sgstAmountListArray'][this.itemRowsCount] = 0;
    }

    initializeInvoiceObject() {
        this.productOrderBillCreation['hsnListArray'] = [];
        this.productOrderBillCreation['productitemListArray'] = [];
        this.productOrderBillCreation['PODetailsIdListArray'] = [];
        this.productOrderBillCreation['ProductNameArray'] = [];
        this.productOrderBillCreation['ProductDescriptionArray'] = [];
        this.productOrderBillCreation['qtyListArray'] = [];
        this.productOrderBillCreation['qtyUnitListArray'] = [];
        this.productOrderBillCreation['qtycodeListArray'] = [];
        this.productOrderBillCreation['valueperunitListArray'] = [];
        this.productOrderBillCreation['InvoiceAmountListArray'] = [];
        this.productOrderBillCreation['balanceAmountListArray'] = [];
        this.productOrderBillCreation['disInvoiceAmountListArray'] = [];
        this.productOrderBillCreation['totalvaluelistarr'] = [];
        this.productOrderBillCreation['discountlistarr'] = [];

        this.productOrderBillCreation['taxableAmountListArray'] = [];
        this.productOrderBillCreation['igstRateListArray'] = [];
        this.productOrderBillCreation['igstAmountListArray'] = [];
        this.productOrderBillCreation['cgstRateListArray'] = [];
        this.productOrderBillCreation['cgstAmountListArray'] = [];
        this.productOrderBillCreation['sgstRateListArray'] = [];
        this.productOrderBillCreation['sgstAmountListArray'] = [];
        this.productOrderBillCreation['is_bill_subject_to_reverse_charges'] = false;
        this.productOrderBillCreation['vehicle_number'] = "";

        // this.itemsDetails = [];
        this.productOrderBillCreation['branch_invoice_reference_prefix'] = "";
        this.itemRows = [];
        this.itemRowsCount = 0;

    }

    initializeObjectForUpdate(invoiceDetails?) {

        this.product();
        if (invoiceDetails) {
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
        this.productOrderBillCreation['PODetailsIdListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['ProductNameArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['ProductDescriptionArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['qtyListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['qtyUnitListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['qtycodeListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['valueperunitListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['InvoiceAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['balanceAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['disInvoiceAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['totalvaluelistarr'].splice(removeIndex, 1);
        this.productOrderBillCreation['discountlistarr'].splice(removeIndex, 1);
        this.productOrderBillCreation['taxableAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['igstRateListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['igstAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['cgstRateListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['cgstAmountListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['sgstRateListArray'].splice(removeIndex, 1);
        this.productOrderBillCreation['sgstAmountListArray'].splice(removeIndex, 1);
        this.itemsDetails.splice(removeIndex, 1);
        this.onDiscountChange();
    }

    hsnCodeKeyUp(itemIndex) {
        if (this.productOrderBillCreation['hsnListArray'][itemIndex].length == 0) {
        }
    }
    onDiscountChange() {
        this.productOrderBillCreation["invoice_per"] = this.getArraySum(this.productOrderBillCreation['discountlistarr']);
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
    }
    taxablecalculationdetail() {
        this.productOrderBillCreation["taxableAmount"] = 0;
        this.productOrderBillCreation["totalcgst"] = 0;
        this.productOrderBillCreation["totalsgst"] = 0;
        this.productOrderBillCreation["totaligst"] = 0;
        let totaltaxvalue = 0;
        let totalamountcgst = 0;
        let totalamountsgst = 0;
        let totalamountigst = 0;
        for (let key in this.itemRows) {
            let totalamountwithoutdiscount: number = 0;
            let discount_amount: number = 0;
            if (parseFloat(this.productOrderBillCreation['discountlistarr'][key]) > 0) {
                discount_amount = ((parseFloat(this.productOrderBillCreation['balanceAmountListArray'][key]) * parseFloat(this.productOrderBillCreation['discountlistarr'][key])) / 100);
                this.productOrderBillCreation['disInvoiceAmountListArray'][key] = discount_amount//this.productOrderBillCreation['balanceAmountListArray'][key] - discount_amount
                totalamountwithoutdiscount = this.productOrderBillCreation['disInvoiceAmountListArray'][key]
            }
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
        this.productOrderBillCreation["total_invoice_amount"] = this.getArraySum(this.productOrderBillCreation['disInvoiceAmountListArray'])
        this.productOrderBillCreation["taxableAmount"] = totaltaxvalue
    }

    getArraySum(arrayList) {
        let sum_amount = 0
        sum_amount = arrayList.reduce((sum, item) => sum + parseFloat(item), 0);
        return sum_amount;
    }

    onSubmit() {
        let url = 'Invoice/InsertInvoice';
        let bodyobj: any = {};
        bodyobj["SupplierId"] = this.vendorList[0].SupplierId;
        bodyobj["CompanyId"] = this.vendorList[0].CompanyId;
        bodyobj["BranchId"] = this.vendorList[0].BranchId;
        bodyobj["POHeaderId"] = this.vendorList[0].POHeaderId
        bodyobj["ProjectId"] = this.vendorList[0].ProjectId
        bodyobj["SuppervisorId"] = this.productOrderBillCreation.SuppervisorId
        bodyobj["SerialNumber"] = null
        bodyobj["InvoiceNo"] = this.vendorList[0].InvoiceNo
        bodyobj["InvoiceDate"] = this.productOrderBillCreation["InvoiceDate"]
        bodyobj["PageId"] = 1;
        bodyobj["LedgerId"] = 1
        bodyobj["CostCenterId"] = 1
        bodyobj["InvoiceAmount"] = this.productOrderBillCreation["total_invoice_amount"]
        bodyobj["InvoiceAmountWords"] = this.productOrderBillCreation["InvoiceAmountWords"]
        bodyobj["VerifiedLevelId"] = 1
        bodyobj["VerifiedStatusId"] = 1
        bodyobj["InvoiceType"] = this.vendorList[0].ServiceType
        bodyobj["CGSTAmount"] = this.productOrderBillCreation["totalcgst"];
        bodyobj["SGSTAmount"] = this.productOrderBillCreation["totalsgst"];
        bodyobj["IGSTAmount"] = this.productOrderBillCreation["totaligst"]
        bodyobj["total_expense"] = 0;
        bodyobj["total_amount"] = this.productOrderBillCreation["taxableAmount"]
        bodyobj["is_bill_against_advanced"] = false
        bodyobj["reference_number"] = "BSMS"
        bodyobj["SessionId"] = "2018-19"
        bodyobj["ChapterTypeId"] = null
        bodyobj["Branch_invoice_reference_prefix_id"] = null
        bodyobj["BankId"] = null
        bodyobj["ChequeNumber"] = null
        bodyobj["TransactionTypeId"] = 1
        bodyobj["CreatedBy"] = 1
        bodyobj["ModifyBy"] = 1
        bodyobj["BillStatusId"] = 1 
        let arraylist = [];
        for (let key in this.productOrderBillCreation['valueperunitListArray']) {
            let arrayobj = {};
            arrayobj["HSNCode"] = this.productOrderBillCreation['hsnListArray'][key];
            arrayobj["ProductId"] = this.productOrderBillCreation['productitemListArray'][key]
            arrayobj["UOMId"] = this.productOrderBillCreation['qtycodeListArray'][key]
            arrayobj["Qty"] = this.productOrderBillCreation['qtyListArray'][key]
            arrayobj["Rate"] = this.productOrderBillCreation['valueperunitListArray'][key]
            arrayobj["Discount"] = this.productOrderBillCreation['discountlistarr'][key]
            arrayobj["TotalPrice"] = this.productOrderBillCreation['disInvoiceAmountListArray'][key]//  this.productOrderBillCreation['taxableAmountListArray'][key]
            arrayobj["PODetailsId"] = this.productOrderBillCreation['PODetailsIdListArray'][key]
            arrayobj["IGST"] = this.productOrderBillCreation['igstRateListArray'][key]
            arrayobj["CGST"] = this.productOrderBillCreation['cgstRateListArray'][key]
            arrayobj["SGST"] = this.productOrderBillCreation['sgstRateListArray'][key]
            arrayobj["ExtraCharges"] = parseFloat(arrayobj["IGST"]) + parseFloat(arrayobj["CGST"]) + parseFloat(arrayobj["SGST"])
            arrayobj["GrandTotal"] = parseFloat(arrayobj["TotalPrice"]) + parseFloat(arrayobj["IGST"]) + parseFloat(arrayobj["CGST"]) + parseFloat(arrayobj["SGST"])
            arraylist.push(arrayobj)
        }
        bodyobj["Aims_Invoice_Detail"] = arraylist;
        this.apiResponsesLoderFlag.push(true);
        this.httpApiService.post(url, bodyobj).then(res => {
            // if (res) {
                Swal({
                    title: 'Invoice Has Been Created Sucessfully Save.',
                   // text: 'You will not be able to recover this imaginary file!',
                    type: 'success',//success
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    // cancelButtonText: 'No, keep it'
                  }).then((result) => {
                    debugger;
                    if (result.value) {
                      //localStorage.setItem('bill_po_list', JSON.stringify(this.elements["productlist"]));
                      this.router.navigate(['/invoice/invoice-detail']);
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
                this.apiResponsesLoderFlag.pop();
            });
    }
}
