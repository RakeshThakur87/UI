import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { HttpApiService } from '../../../../../shared/http-api.service';
import { config } from '../../../../../shared/constant';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Injectable } from '@angular/core';

@Component({  
    selector: 'supplier-creation',
    templateUrl: './supplier.html',
    styleUrls: ['./supplier.css'],
    providers: [HttpApiService]
})

export class SupplierCreationComponent implements OnInit {
    public user = localStorage.getItem('user');
    public currendate: any = {};
    public elements: any = {};
    public apiResponsesLoderFlag = [];
    private producttypeListobj: any = [{ id: 1, name: "food" }, { id: 2, name: "beverage" }, { id: 3, name: "soft drink" }];
    private UomListobj: any = [{ id: 1, name: "Haryana" }, { id: 2, name: "Delhi" }, { id: 3, name: "Chandigardh" }]
    isValidFormSubmitted = false;
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.reset();
    }

    ngOnInit() {
    }

    Redirect() {
        this.router.navigate(['/master/update-supervisor/12']);
    }

    reset() {
        this.elements["product_item_code"] = "";
        this.elements["product_item_name"] = "";
        this.elements["product_dicount"] = 0;
        this.elements["product_gst_tax"] = 0;
        this.elements["product_uom_id"] = "";        
        this.elements["product_type"] = "";
        this.elements["purchase_ledger_id"] = "";
        this.elements["product_type"] = "";
        this.elements["product_group_id"] = "";       
        this.elements["sale_ledger_id"] = "";
    }
   
    submit(form: NgForm) {
        debugger;
        this.isValidFormSubmitted = false;
        if (form.invalid) {
            return;
        }
        if (form.valid) {
            let url = "product/saveData"
            this.apiResponsesLoderFlag.push(true);
            this.httpApiService.post(url, this.elements).then(res => {
                debugger;
                if (res) {
                }
                this.apiResponsesLoderFlag.pop();
            });
        }
    }   
}
