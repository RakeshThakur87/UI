import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { HttpApiService } from '../../../../../shared/http-api.service';
import { config } from '../../../../../shared/constant';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
@Component({  
    selector: 'application',
    templateUrl: './application.html',
    styleUrls: ['./application.css'],
    providers: [HttpApiService]
})

export class ApplicationCreationComponent implements OnInit {
    public user = localStorage.getItem('user');
    public currendate: any = {};
    public elements: any = {};
    public apiResponsesLoderFlag = [];
    private applicationtypeobj: any = []
    
    isValidFormSubmitted = false;
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService,private toasterService: ToasterService) {
        this.reset();
        debugger;
        this.applicationtypeobj = [{ id: 1, value: "B2B" }, { id: 2, value: "B2C" }]
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
        this.elements["ApplicationCode"] = "";
        this.elements["ApplicationType"] = "";
        this.elements["ApplicationUrl"] = "";
        this.elements["Name"] = "";
    }

    submit(form: NgForm) {
        debugger;
        this.isValidFormSubmitted = false;
        if (form.invalid) {
            return;
        }
        if (form.valid) {
            debugger;
            let url = "sso/InsertApplicationData"
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
