import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { appSettings } from '../../../../../configs/app-settings.config';
import { appToaster } from '../../../../../configs/app-toaster.config';
import { ToasterService } from 'angular2-toaster';
import { IndustryService } from '../../../../../core/services/industry.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'application',
  templateUrl: './industrycategory.html',
  styleUrls: ['./industrycategory.css'],
  providers: [IndustryService]
})

export class IndustryCatCreationComponent implements OnInit {
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
    private staticService: IndustryService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.hide = true;    
    this.intilizeForm();
    this.bindindustrylist();

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
  private bindindustrylist() {
    this.staticService.GetIndustryddlList()
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
