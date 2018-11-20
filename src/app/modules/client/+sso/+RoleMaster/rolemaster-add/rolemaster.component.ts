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

@Component({  
    selector: 'rolemaster',
    templateUrl: './rolemaster.html',
    styleUrls: ['./rolemaster.css'],
    providers: [HttpApiService]
})
export class RoleMasterComponent implements OnInit {
    public user = localStorage.getItem('user');
    public elements: any = {};
    public apiResponsesLoderFlag = [];
    isValidFormSubmitted = false;
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.reset();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            let id = params['id'];
            console.log(id); // Print the parameter to the console. 
        });
    }

    Redirect() {
        this.router.navigate(['/SSO/role-master']);
    }

    reset() {
        this.elements["Name"] = "";
    }

    SaveData(form: NgForm) {
        debugger;
        this.isValidFormSubmitted = false;
        if (form.invalid) {
            return;
        }
        if (form.valid) {
           
            let url = "sso/InsertRoleMasterData"
            this.apiResponsesLoderFlag.push(true);
            this.httpApiService.post(url, this.elements).then(res => {
                debugger;
                if (res) {
                    this.Redirect();
                }
                this.apiResponsesLoderFlag.pop();
            });
        }
    }
   
}
