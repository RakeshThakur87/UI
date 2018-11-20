import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { appSettings } from '../../../../configs/app-settings.config';
import { appToaster } from '../../../../configs/app-toaster.config';
import { ToasterService } from 'angular2-toaster';
import { ProjectService } from '../../../../core/services/project.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { StateService } from '../../../../core/services/state.service';
import { CompanySettingsService } from '../../../../core/services/companysettings.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'application',
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
  providers: [ProjectService]
})

export class ProjectCreationComponent implements OnInit {
  addnewitemForm: FormGroup;
  appSettings = appSettings;
  isSubmit: boolean;
  isSuccess: boolean;
  message: string;
  hide: boolean;
  industries: any[];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private stateService: StateService,
    private companyService:CompanySettingsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.hide = true;    
    this.intilizeForm();
    this.StateList();
    var CompanyId=1;
    this.SupplierBranchList(CompanyId);
    var SupplierId=1;
    this.bindEmployeelist(SupplierId);
  }

  intilizeForm(): void {
    this.addnewitemForm = this.fb.group({
      dataInfo: this.fb.group({
        Name: ['', [Validators.required, Validators.maxLength(100)]],
        IndustryCode: ['', [Validators.required, Validators.maxLength(100)]],
        ParentId: ['0', [Validators.required]],
        skills: [[], Validators.required]
      }),
    });
  }
  private StateList() {
    this.stateService.GetStateddlList()
      .subscribe((data: any) => {
        this.industries = data;
      });
  }

  private SupplierBranchList(CompanyId) {
    this.companyService.GetCompanyWisebranchddlList(CompanyId)
      .subscribe((data: any) => {
        this.industries = data;
      });
  }

  private bindEmployeelist(SupplierId) {    
    this.employeeService.GetEmployeebybranchddlList(SupplierId)
      .subscribe((data: any) => {
        this.industries = data;
      });
  }

  

  onSubmit(): boolean {
    debugger;
    this.isSubmit = true;
    if (this.addnewitemForm.invalid) {
      return false;
    } else {
      debugger;
      this.projectService.InsertData(this.addnewitemForm.value.dataInfo)
        .subscribe((res) => {
          if (res.status === 'success') {
            // this.toasterService.pop('success', appToaster.successHead, res.message);
            // this.router.navigate(['/auth/login']);
            this.isSuccess = true;
            this.message = res.message;
          } else {
            this.toasterService.pop('error', appToaster.errorHead, res.message);
            this.router.navigate(['/client/signup']);
          }
        });
    }
  }
}
