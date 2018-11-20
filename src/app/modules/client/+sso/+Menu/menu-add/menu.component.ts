import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { HttpApiService } from '../../../../../shared/http-api.service';
// import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
// import { setTheme } from 'ngx-bootstrap/utils';
import { config } from '../../../../../shared/constant';
//import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';

@Component({
  
    selector: 'menu',
    templateUrl: './menu.html',
    styleUrls: ['./menu.css'],
    providers: [HttpApiService]
})

export class MenuCreationComponent implements OnInit {
    public user = localStorage.getItem('user');
    public currendate: any = {};
    public elements: any = {};
    public apiResponsesLoderFlag = [];
    private menuOrderObj: any = []
    private applicationobj: any = []
    isValidFormSubmitted = false;
    bsRangeValue: Date[];
    public AJAX_LOADER_PIC_WITH_PATH = config.AJAX_LOADER_PIC_WITH_PATH;

    constructor(public route: ActivatedRoute, public router: Router, public httpApiService: HttpApiService) {
        this.reset();
        this.applicationobj = [{ id: 1, value: "Male" }, { id: 2, value: "Female" }, { id: 3, value: "Others" }]
    
        while (this.menuOrderObj.length < 100) {
            this.menuOrderObj.push(this.menuOrderObj.length + 1);
        }
    
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
        this.elements["Name"] = "";
        this.elements["IsHaveChildMenu"] = true;
        this.elements["ParentMenuId"] = "";
        this.elements["ShortName"] = "";
        this.elements["Path"] = "";
        this.elements["ToolTip"] = "";
        this.elements["ModuleId"] = ""
        this.elements["IndustryId"] = ""
        this.elements["MenuOrder"] = ""
    }

    submit(form: NgForm) {
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
