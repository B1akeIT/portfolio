import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { InvoicesService } from '../invoices.service';
import { APP_CONST } from '@app/shared/const';

@Component({
  selector: 'app-invoices-filter',
  templateUrl: './invoices-filter.component.html',
  styleUrls: ['./invoices-filter.component.scss']
})
export class InvoicesFilterComponent implements OnInit {
  // https://dzone.com/articles/how-to-create-a-multi-field-data-filters-innbspang-1
  form: FormGroup;

  @Output() autoSearch: EventEmitter<string> = new EventEmitter<string>();

  @Output() groupFilters: EventEmitter<any> = new EventEmitter<any>();

  searchText: string = '';

  currentFilters = {};

  qualifications = [];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private invoicesService: InvoicesService
  ) { }

  ngOnInit() {
    this.buildForm();

    // this.invoicesService.getListChoices('tab_qualifica').subscribe(
    //   (data: any) => {
    //     this.qualifications = data.data.map((item) => {
    //       return {
    //         key: item.key,
    //         label: this.translate.instant('APP.TABLE.QUALIFICATION.' + item.key)
    //       };

    //     });
    //     this.clearFilter();
    //   }
    // );
  }

  buildForm(): void {
    this.form = this.fb.group({
      invoice_type: new FormControl(''),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      companyname: new FormControl(''),
      vat: new FormControl(''),
      is_company: new FormControl(''),
      qualification: new FormControl('')
    });
  }

  applyFilter(filters: any): void {
    Object.keys(filters).forEach(key => (!filters[key] || filters[key] === '') ? delete filters[key] : key);
    this.groupFilters.emit(filters);
    this.currentFilters = filters;
  }

  clearFilter(emit = true) {
    this.form.reset();
    const filters = {};
    if (emit) { this.groupFilters.emit(filters); }
    this.currentFilters = filters;
  }
}
