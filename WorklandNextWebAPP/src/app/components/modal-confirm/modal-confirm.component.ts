import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  title: string = '';
  message: string = '';
  cancelText: string = '';
  confirmText: string = '';

  onClose: Subject<any>;

  constructor(
    public bsModalRef: BsModalRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  closeModal(confirm: boolean = false) {
    this.onClose.next(confirm);
    this.bsModalRef.hide();
  }
}
