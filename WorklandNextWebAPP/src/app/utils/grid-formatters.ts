import { formatCurrency } from '@angular/common';
import { Injectable } from '@angular/core';

import { APP_CONST } from '@app/shared';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GridFormatters {

  // bind
  locale = 'it-IT';
  currency = '€';
  currencyCode = 'EUR';
  digitsInfo = '1.2-2';

  constructor() {}

  avatarFormatter(row, cell, value, columnDef, dataContext) {
    let imgClass = 'img-thumbnail bg-white';
    let defaultAvatar = './assets/img/asset.gif';
    let type = 'original';
    let avatarUrl = defaultAvatar;
    if (columnDef.params) {
      if (columnDef.params.cssClass) {
        imgClass = columnDef.params.cssClass;
      }
      if (columnDef.params.defaultAvatar) {
        defaultAvatar = columnDef.params.defaultAvatar;
      }
      if (columnDef.params.type) {
        type = columnDef.params.type;
      }
    }
    if (typeof value === 'object') {
      // get image url
      const domain = 'guastalla';
      avatarUrl = APP_CONST.apiUrl + '/medium/' + value.id + '/' + type + '?quickart_tenant_domain=' + domain;
    } else {
      avatarUrl = value ? value : defaultAvatar;
    }
    return '<img class="' + imgClass + '" src =\'' + avatarUrl + '\'></img>';
  }

  artworkDimensionsFormatter(row, cell, value, columnDef, dataContext) {
    let cssClass = '';
    let result = '';
    if (columnDef.params) {
      if (columnDef.params.cssClass) {
        cssClass = columnDef.params.cssClass;
      }
      if (columnDef.params.dh && +dataContext[columnDef.params.dh]) {
        result += dataContext[columnDef.params.dh];
      }
      if (columnDef.params.dl && +dataContext[columnDef.params.dl]) {
        result += 'x' + dataContext[columnDef.params.dl];
      }
      if (columnDef.params.dp && +dataContext[columnDef.params.dp]) {
        result += 'x' + dataContext[columnDef.params.dp];
      }
    }
    return '<span class="' + cssClass + '">' + result + '</span>';
  }

  artworkDimensionsExport(row, cell, value, columnDef, dataContext) {
    let result = '';
    if (columnDef.params) {
      if (columnDef.params.dh && dataContext[columnDef.params.dh]) {
        result += dataContext[columnDef.params.dh];
      }
      if (columnDef.params.dl && dataContext[columnDef.params.dl]) {
        result += 'x' + dataContext[columnDef.params.dl];
      }
      if (columnDef.params.dp && dataContext[columnDef.params.dp]) {
        result += 'x' + dataContext[columnDef.params.dp];
      }
    }
    return result;
  }

  contactMetaFormatter(row, cell, value, columnDef, dataContext) {
    // console.log(row, cell, value, columnDef, dataContext);
    let object = '';
    let key = '';
    let result = '';
    if (columnDef.params) {
      if (columnDef.params.object) {
        object = columnDef.params.object;
        key = columnDef.params.key;
        result = dataContext['q_meta'][object][key];
      } else if (columnDef.params.key) {
        key = columnDef.params.key;
        result = dataContext['q_meta'][key];
      }
    }
    return result;
  }

  authorNameFormatter(row, cell, value, columnDef, dataContext) {
    // console.log(row, cell, value, columnDef, dataContext);
    let all = false;
    let result = '';
    if (columnDef.params) {
      if (columnDef.params.all) {
        all = columnDef.params.all;
      }
    }
    if (dataContext['authors'] && dataContext['authors'].data.length) {
      const author = dataContext['authors'].data[0];
      result = author.firstname + ' ' + author.lastname;
    }
    return result;
  }

  formatNumber(number) {
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  currencyFormatter(params) {
    const cssClass = 'pull-right';
    const currency = formatCurrency(params.value || 0, this.locale, this.currency, this.currencyCode, this.digitsInfo);
    return '<span class="' + cssClass + '">' + currency + '</span>';
  }

  dateFormatter(params) {
    const cssClass = '';
    const date = params.value ? moment(params.value, 'YYYY-MM-DD').format('DD-MM-YYYY') : '';
    return '<span class="' + cssClass + '">' + date + '</span>';
  }

  checkBoxormatter(params) {
    let cssClass = 'badge-';
    let result = '';
    if (params.value) {
      cssClass += ' badge-success-';
      result = '√';
    } else {
      cssClass += ' badge-light-';
      result = '';
    }
    return '<span class="' + cssClass + '">' + result + '</span>';
  }

  onOffFormatter(params) {
    let cssClass = 'badge badge-pill-';
    let result = '';
    if (params.value) {
      cssClass += ' badge-success';
      result = 'ON';
    } else {
      cssClass += ' badge-danger';
      result = 'OFF';
    }
    return '<span class="' + cssClass + '">' + result + '</span>';
  }

  progressFormatter(params) {
    if (params.value) {
      return `<div class="progress rounded-0 border" style="height: 14px;margin-top: 0.35rem;"><div class="progress-bar" style="width: ${params.value}%;" aria-valuenow="${params.value}" aria-valuemin="0" aria-valuemax="100">${params.value}</div></div>`;
    } else {
      return `<div class="progress rounded-0 border" style="height: 14px;margin-top: 0.35rem;"><div class="progress-bar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>`;
    }
  }

  multiProgressFormatter(params) {
    if (params.value) {
      const values = params.value.split('%');
      const colors = [
        '#ffffff',
        '#ffffff',
        '#55ed99',
        '#d3d3d3',
        '#d3d3d3',
        '#d3d3d3',
        '#d3d3d3',
        '#f08080'
      ]
      let result = '<div class="progress rounded-0 border" style="height: 14px;margin-top: 0.35rem;">';
      values.forEach((value, index) => {
        result += `
          <div class="progress-bar" role="progressbar" style="width: ${value}%;background-color: ${colors[index]};">${value}</div>
        `;
      });
      result += '</div>';
      return result;
    } else {
      return `<div class="progress rounded-0 border" style="height: 14px;margin-top: 0.35rem;"><div class="progress-bar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>`;
    }
  }
}
