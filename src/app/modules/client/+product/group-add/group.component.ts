import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { appSettings } from '../../../../configs/app-settings.config';
import { appToaster } from '../../../../configs/app-toaster.config';
import { ToasterService } from 'angular2-toaster';
import { ProductService } from '../../../../core/services/product.service';
import { IndustryService } from '../../../../core/services/industry.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'group-creation',
  templateUrl: './group.html',
  styleUrls: ['./group.css'],
  providers: [ProductService]
})

export class GroupCreationComponent implements OnInit {
  addnewitemForm: FormGroup;
  appSettings = appSettings;
  isSubmit: boolean;
  isSuccess: boolean;
  message: string;
  hide: boolean;
  itemList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private staticService: ProductService,
    private industryservice:IndustryService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.hide = true;
    this.intilizeForm();
    this.industryservice.GetIndustryddlList()
        .subscribe(res => {
            console.log(res);
            this.itemList = res;
        },error => {
        });
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      searchBy: ['itemName'],
      searchPlaceholderText: 'Search by name',
      classes: "myclass custom-class"
    };
  }

  intilizeForm(): void {
    this.addnewitemForm = this.fb.group({
      dataInfo: this.fb.group({
        Name: ['', [Validators.required, Validators.maxLength(100)]],
        CategoryCode: ['', [Validators.required, Validators.maxLength(100)]],
      }),
    });
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  onSubmit(): boolean {
    this.isSubmit = true;
    if (this.addnewitemForm.invalid) {
      return false;
    } else {
      this.staticService.InsertProductGroupData(this.addnewitemForm.value.dataInfo)
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
