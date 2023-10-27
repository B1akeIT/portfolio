import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent implements OnInit, OnChanges {
  // https://dzone.com/articles/how-to-create-a-multi-field-data-filters-innbspang-1
  form: FormGroup;

  @Input() fields = null;
  @Input() sorting = null;
  @Input() showTitle = true;
  @Input() showDropDown = false;

  @Output() groupSorting: EventEmitter<any> = new EventEmitter<any>();

  currentSorting = [];

  constructor(
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {
    // this.clearSorting(false);
  }

  ngOnChanges(changes: any) {
    if (changes.sorting) {
      if (changes.sorting.currentValue.column && changes.sorting.currentValue.direction) {
        this.sorting = changes.sorting.currentValue;
        this.form.patchValue({
          column: this.sorting.column,
          direction: this.sorting.direction
        });
        if (!this.currentSorting.includes(this.sorting)) {
          this.currentSorting = [this.sorting];
        }
      } else {
        this.sorting = [];
      }
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      column: new FormControl('', [Validators.required]),
      direction: new FormControl('', [Validators.required])
    });
  }

  applySorting(sorting: any): void {
    Object.keys(sorting).forEach(key => (!sorting[key] || sorting[key] === '') ? delete sorting[key] : key);
    this.sorting = sorting;
    this.groupSorting.emit(sorting);
    if (!this.currentSorting.includes(sorting)) {
      this.currentSorting = [sorting];
    }
  }

  clearSorting(emit = true) {
    this.form.reset();
    const sorting = [];
    if (emit) { this.groupSorting.emit(sorting); }
    this.currentSorting = sorting;
  }

  isSortAsc() {
    return (this.sorting.direction === 'asc');
  }
}
