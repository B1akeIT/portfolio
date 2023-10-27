import { Component, Input, OnChanges, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-item-attribute',
  templateUrl: './item-attribute.component.html',
  styleUrls: ['./item-attribute.component.scss']
})
export class ItemAttributeComponent implements OnInit, OnChanges {

  @Input() attribute = null;
  @Input() excluded = [];
  @Input() hideEmpty = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    if (changes.attribute) {
      this.attribute = changes.attribute.currentValue;
    }
  }

  isExcluded() {
    let isExcluded = false;
    if (this.attribute) {
      const isIncluded = _.includes(this.excluded, this.attribute.key);
      if ((this.hideEmpty && !this.attribute.value) || isIncluded) {
        isExcluded = true;
      }
    }
    return isExcluded;
  }

  getContactField(field, html = true) {
    let result = '';

    const value = this.attribute.value || '---';

    switch (field) {
      case 'email':
        result = `<span class="">${value}</span>`;
        break;

      case 'lingua':
        result = `<span class="" title="${value.id}">${value.descrizione} | ${value.culture}</span>`;
        break;

      case 'valuta':
        result = `<span class="" title="${value.id}">${value.descrizione} | ${value.simbolo}</span>`;
        break;

      case 'iva':
      case 'tipoPagamento':
        result = `<span class="" title="${value.codice}">${value.descrizione}</span>`;
        break;

      case 'nazione':
      case 'tipoCliente':
      case 'descrizioneMail':
      case 'origineContatto':
      case 'valutazione':
      case 'shipType':
      case 'shipyard':
      case 'cab':
      case 'abi':
      case 'modalitaPagamento':
        result = `<span class="" title="${value.id}">${value.descrizione}</span>`;
        break;

      default:
        result = value;
    }

    return result;
  }
}
