import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { appSettings } from '../../../../../configs/app-settings.config';
import { appToaster } from '../../../../../configs/app-toaster.config';

import { ToasterService } from 'angular2-toaster';
import { IndustryService } from '../../../../../core/services/industry.service';

import { environment } from '../../../../../../environments/environment';

import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

const URL  = `${environment.host}${environment.fileupload}`;

@Component({
  selector: 'department-create',
  templateUrl: './department.html',
    // styleUrls: ['./department.css'],
})
export class DepartmentCreationComponent implements OnInit {
  addnewitemForm: FormGroup;
  appSettings = appSettings;
  isSubmit: boolean;
  isSuccess: boolean;
  message: string;
  hide: boolean;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private staticService: IndustryService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.hide = true;
    this.intilizeForm();
  }

  intilizeForm(): void {
    this.addnewitemForm = this.fb.group({
      dataInfo: this.fb.group({
        Name: ['', [Validators.required, Validators.maxLength(100)]],
        IndustryCode: ['', [Validators.required, Validators.maxLength(100)]],
      }),
    });
  }

  onSubmit(): boolean {
    debugger;
    this.isSubmit = true;
    if (this.addnewitemForm.invalid) {
      return false;
    } else {
        debugger;
      this.staticService.InsertData(this.addnewitemForm.value.dataInfo)
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

