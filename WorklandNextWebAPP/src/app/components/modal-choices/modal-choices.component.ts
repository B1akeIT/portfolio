import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-choices',
  templateUrl: './modal-choices.component.html',
  styleUrls: ['./modal-choices.component.scss']
})
export class ModalChoicesComponent implements OnInit, OnChanges {

  model: string = '';
  contactType: string = '';

  onClose: Subject<any>;

  _model: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model) {
      this.model = changes.model.currentValue;
      this._model = this.model === 'unit' ? 'contact' : this.model;
    }
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onSelected(item) {
    this.onClose.next(item);
    this.bsModalRef.hide();
  }
}
