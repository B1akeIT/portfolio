import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-contact',
  templateUrl: './modal-contact.component.html',
  styleUrls: ['./modal-contact.component.scss']
})
export class ModalContactComponent implements OnInit {

  contactId = null;
  contactTitle = null;
  showHeader = false;
  showFooter = false;

  onClose: Subject<any>;

  constructor(
    public bsModalRef: BsModalRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  onSelected(contactId) {
    this.onClose.next(contactId);
    this.bsModalRef.hide();
  }
}
