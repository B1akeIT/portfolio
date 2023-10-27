import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { NotificationService } from '@app/core/notifications/notification.service';
import { OrdersSuppliersService } from '../orders-suppliers.service';

@Component({
  selector: 'app-modal-order-supplier-item',
  templateUrl: './modal-order-supplier-item.component.html',
  styleUrls: ['./modal-order-supplier-item.component.scss']
})
export class ModalOrderSupplierItemComponent implements OnInit, AfterContentChecked {

  itemId = null;
  orderId = null;
  numeroRiga = null;
  title = null;
  showHeader = false;
  showFooter = false;

  onClose: Subject<any>;

  modalForm: FormGroup;

  _isFormValid: boolean = false;
  _isModified: boolean = false;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private ordersService: OrdersSuppliersService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  ngAfterContentChecked() {
    this._isFormValid = (this.modalForm && this.modalForm.valid);
  }

  buildForm(): void {
    this.modalForm = this.fb.group({});
  }

  closeModal() {
    this.bsModalRef.hide();
  }

  save(form) {
    const id = (this.itemId) ? this.itemId : 0;
    const body = form.value;

    // console.log('save', id, body);
    this.ordersService.saveArticolo(id, body).subscribe(
      (response => {
        this._isModified = false;
        this.onClose.next(response);
        this.bsModalRef.hide();
      }),
      (error => {
        console.log('error', error);
        const title = this.translate.instant('APP.MESSAGE.error') + ' ' + error.error.status_code;
        const message = error.message;
        this.notificationService.error(message, title);
      })
    );
  }

  onModified(event) {
    // console.log('onModified', event);
    this._isModified = true;
  }
}
