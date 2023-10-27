import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-companies-sorting',
  templateUrl: './companies-sorting.component.html',
  styleUrls: ['./companies-sorting.component.scss']
})
export class CompaniesSortingComponent implements OnInit {
  // https://dzone.com/articles/how-to-create-a-multi-field-data-filters-innbspang-1
  form: FormGroup;

  @Input() showFilter = true;

  @Output() groupSorting: EventEmitter<any> = new EventEmitter<any>();

  currentSorting = [];

  fields = [
    'id',
    'firstname',
    'lastname',
    'companyname',
    'qualification'
  ];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    this.clearSorting(false);
  }

  buildForm(): void {

    this.form = this.fb.group({
      field: new FormControl('', [Validators.required]),
      direction: new FormControl('', [Validators.required])
    });
  }

  applySorting(sorting: any): void {
    Object.keys(sorting).forEach(key => (!sorting[key] || sorting[key] === '') ? delete sorting[key] : key);
    this.groupSorting.emit(sorting);
    if (!this.currentSorting.includes(sorting)) {
      this.currentSorting = [sorting];
      // this.currentSorting.push(sorting);
    }
  }

  clearSorting(emit = true) {
    this.form.reset();
    const sorting = [];
    if (emit) { this.groupSorting.emit(sorting); }
    this.currentSorting = sorting;
  }
}
