import { Component, Output, OnInit, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';

import { AuthenticationService } from '@app/services/authentication.service';
import { GridUtils } from '@app/utils/grid-utils';

import { ChoiceService } from './choice.service';

@Component({
  selector: 'app-choice-list-model',
  templateUrl: './choice-list-model.component.html',
  styleUrls: ['./choice-list-model.component.scss']
})
export class ChoiceListModelComponent implements OnInit, OnChanges {

  @Input() model: string;
  @Input() contactType: string;

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  modelData: any[] = [];
  modelMeta = null;

  loading = false;

  filter = '';
  searched = false;

  _model: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private gridUtils: GridUtils,
    private choiceService: ChoiceService
  ) { }

  ngOnInit() {
    const tenant = this.authenticationService.getCurrentTenant();

    this.choiceService.reset();
    this.choiceService.setTenent(tenant);
    this.choiceService.setContactType(this.contactType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model) {
      this.model = changes.model.currentValue;
      this._model = this.model === 'unit' ? 'contact' : this.model;
    }
  }

  getData(model, filter) {
    this.loading = true;
    this.searched = false;
    this.modelData = [];
    this.choiceService.setQuery(filter);
    this.choiceService.setPerPage(100);
    this.choiceService.getListModel().subscribe(
      (response: any) => {
        this.modelData = (response.items || []).map(item => this.gridUtils.renameJson(item));
        // this.modelMeta = response.meta;
        this.loading = false;
        this.searched = true;
      }
    );
  }

  filterChanged(event: any) {
    event.preventDefault();
    this.getData(this.model, this.filter);
  }

  clearFilter(event: any) {
    event.preventDefault();
    this.filter = '';
    this.modelData = [];
    this.searched = false;
  }

  onSelectedModel(item) {
    this.choiceService.getModel(item.id).subscribe(
      (response: any) => {
        const _data = this.gridUtils.renameJson(response);
        this.selected.emit({ model: this.model, item: _data });
      }
    );
  }
}
