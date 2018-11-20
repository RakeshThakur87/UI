import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { HttpApiService } from '../../../../../shared/http-api.service';
// import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
// import { setTheme } from 'ngx-bootstrap/utils';
import { config } from '../../../../../shared/constant';
// import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

import { Injectable } from '@angular/core';

@Component({

    selector: 'app-company-creation',
    templateUrl: './company.html',
    styleUrls: ['./company.css'],
    providers: [HttpApiService]
})

export class ComapnyCreationComponent implements OnInit {
    public user = localStorage.getItem('user');
    public currendate: any = {};
    public elements: any = {};
    public apiResponsesLoderFlag = [];
    public stateListobj:any=[];
    private BusinesstypeListobj: any = [{ id: 1, name: "Supplier" }, { id: 2, name: "Agency" }, { id: 3, name: "Company" }];
    private OfficeTypeListobj: any = [{ id: 1, name: "HO" }, { id: 2, name: "RO" }, { id: 3, name: "Area Office" }]
    isValidFormSubmitted = false;
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.reset();
    }

    ngOnInit() {
        this.StateList();
    }

    Redirect() {
        this.router.navigate(['/master/update-supervisor/12']);
    }

    reset() {
        this.elements["Name"] = "";
        this.elements["Code"] = "";
        this.elements["ContactPerson"] = "";
        this.elements["ContactNo"] = "";
        this.elements["Email"] = "";
        this.elements["GSTNO"] = "";
        this.elements["PANNo"] = "";
        this.elements["OfficeTypeId"] = "";
        this.elements["BusinessTypeId"] = "";
        this.elements["P_AddressId"] = "";
        this.elements["C_AddressId"] = "";
        this.elements["B_AddressId"] = "";
    }
    StateList() {
        var CountryId=1;
        this.stateListobj = [];
        if (CountryId) {
            let url = "State/GetState/" + CountryId;
            this.apiResponsesLoderFlag.push(true);
            this.httpApiService.get(url).then(res => {
                debugger
                this.stateListobj = res;
                this.apiResponsesLoderFlag.pop();
            },
                err => {
                    this.apiResponsesLoderFlag.pop();
                });
        }
    }
    submit(form: NgForm) {
        debugger;
        this.isValidFormSubmitted = false;
        if (form.invalid) {
            return;
        }
        if (form.valid) {
            debugger;
            let url = "business/saveData"
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
