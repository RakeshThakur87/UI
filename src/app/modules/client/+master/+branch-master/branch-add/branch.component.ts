import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { HttpApiService } from '../../../../../shared/http-api.service';
// import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
// import { setTheme } from 'ngx-bootstrap/utils';
import { config } from '../../../../../shared/constant';
// import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';

@Component({  
    selector: 'branch',
    templateUrl: './branch.html',
    styleUrls: ['./branch.css'],
    providers: [HttpApiService]
})

export class BranchCreationComponent implements OnInit {
    public user = localStorage.getItem('user');
    public currendate: any = {};
    public elements: any = {};
    public apiResponsesLoderFlag = [];
    private maritalobj: any = []
    private genderobj: any = []
    isValidFormSubmitted = false;
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.reset();
        this.maritalobj = [{ id: 1, value: "Married" }, { id: 2, value: "Un-Married" }]
        this.genderobj = [{ id: 1, value: "Male" }, { id: 2, value: "Female" }, { id: 3, value: "Others" }]
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let id = params['id'];
            console.log(id); // Print the parameter to the console. 
        });
    }

    Redirect() {
        this.router.navigate(['/master/update-supervisor/12']);
    }

    reset() {
        this.elements["MaritalStatusId"] = "";
        this.elements["GenderId"] = "";
        this.elements["AdharCardNo"] = "";
        this.elements["Date_of_Joining"] = new Date();
        this.elements["DOB"] = new Date();
    }

    test(form: NgForm) {
        debugger;
        this.isValidFormSubmitted = false;
        if (form.invalid) {
            return;
        }
        if (form.valid) {
            debugger;
            let url = "EmployeeDetail/InsertEmployeeData"
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
