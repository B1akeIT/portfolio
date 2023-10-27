import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
// import { DialogService } from 'ngx-bootstrap-modal';

import { AuthenticationService } from './authentication.service';
import { OptionsService } from './options.service';
import { TablesService } from '@app/views/tables/tables.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class UtilsService {

  gridApi = null;

  user = null;

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    // private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private optionsService: OptionsService,
    private tablesService: TablesService
  ) {
    this.user = this.authenticationService.getUserTenant();
  }

  // removeYesNo() {
  //   const title = this.translate.instant('APP.TITLE.delete');
  //   const message = this.translate.instant('APP.MESSAGE.are_you_sure');
  //   const cancelText = this.translate.instant('APP.BUTTON.cancel');
  //   const confirmText = this.translate.instant('APP.BUTTON.confirm');

  //   return this.dialogService.confirm(title, message, {
  //     cancelButtonText: cancelText,
  //     cancelButtonClass: 'btn-light btn-sm',
  //     confirmButtonText: confirmText,
  //     confirmButtonClass: 'btn-danger btn-sm',
  //     backdrop: 'static'
  //   });
  // }

  openPrintPreview(data) {
    const datab64 = window.btoa(encodeURIComponent(JSON.stringify(data)));
    const url = APP_CONST.siteUrl + '/#/print-preview/' + datab64;

    let width = window.screen.width;
    let height = window.screen.height;
    width = (width > 1024) ? 980 : 768;
    height = (height > 900) ? 900 : height;
    const params = 'toolbar=0,scrollbars=0,location=0,status=0,menubar=0,resizable=1,width=' + width + ',height=' + height;

    window.open(url, 'print_preview', params);
  }

  openArtworkPreview(artwork) {
    const mainMedium = this.getMainMedium(artwork);
    const mediumId = mainMedium ? mainMedium.id : 0;
    const url = APP_CONST.siteUrl + '/#/artwork-preview/' + artwork.id;

    let width = window.screen.width;
    let height = window.screen.height;
    width = (width > 1024) ? 980 : 768;
    height = (height > 900) ? 900 : height;
    const params = 'toolbar=0,scrollbars=0,location=0,status=0,menubar=0,resizable=1,width=' + width + ',height=' + height;

    window.open(url, 'qart_preview_' + mediumId, params);
  }

  getDimensionsArtwork(artwork, type = 'obj') {
    let result = '';
    const width = type + '_width';
    const height = type + '_height';
    const depth = type + '_depth';

    if (artwork && +artwork[width]) {
      result += artwork[width];
    }
    if (artwork && +artwork[width]) {
      result += 'x' + artwork[height];
    }
    if (artwork && +artwork[depth]) {
      result += 'x' + artwork[depth];
    }

    return result;
  }

  // Main

  getTemplatePreview(template) {
    // const token = this.authenticationService.getAuthorizationToken();
    // const domain = this.authenticationService.getCurrentTenant();
    // let params = '?path:' + template.path;
    // params += ';file:plugin_preview';
    // const urlImage = APP_CONST.apiUrl + '/plugin' + params + '&access_token=' + token + '&quickart_tenant_domain=' + domain;

    return template.preview;
  }

  getMediumImage(attachment, type, asset = 'medium') {
    const id = (attachment && attachment.has_media) ? attachment.id : 0;
    const tenant = this.authenticationService.getCurrentTenant();
    const defaultImage = './assets/img/asset-' + asset + '.gif';
    const urlImage = APP_CONST.apiUrl + '/attachment/' + id + '/' + type + '?tenant=' + tenant;

    return (id) ? urlImage : defaultImage;
  }

  getMainMedium(person) {
    return (person && person.q_main && person.q_main.attachment) ? person.q_main.attachment.medium : null;
  }

  getMainAvatar(person) {
    return (person && person.q_main && person.q_main.attachment) ? person.q_main.attachment.avatar : null;
  }

  getMainMediaUrl(model, type, data) {
    let result = '';
    let attachment = null;

    switch (model) {
      case 'owner':
      case 'client':
      case 'author':
      case 'contact':
        attachment = this.getMainAvatar(data);
        result = this.getMediumImage(attachment, type, 'avatar');
        break;
      case 'artwork':
        attachment = this.getMainMedium(data);
        result = this.getMediumImage(attachment, type, 'medium');
        break;
    }

    return result;
  }

  getMainAuthor(artwork) {
    // return (artwork && artwork.q_main && artwork.q_main.people) ? artwork.q_main.people.author : null;
    return (artwork && artwork.q_main && artwork.q_main.person) ? artwork.q_main.person.author : null;
  }

  getPersonName(person, html = false) {
    let result = '---';

    if (person) {
      if (person.is_company) {
        if (html) {
          result = '<p class="h5 mb-0">';
          result += person.companyname + '</p>';
          if (person.firstname || person.lastname) {
            result += '<p class="text-muted mb-0">';
            result += person.firstname + ' ' + person.lastname + '</p>';
          }
        } else {
          result = person.companyname;
        }
      } else {
        if (html) {
          result = '<p class="h5 mb-0">';
          result += person.firstname + ' ' + person.lastname + '</p>';
          if (person.companyname) {
            result += '<p class="text-muted mb-0">';
            result += person.companyname + '</p>';
          }
        } else {
          result = person.firstname + ' ' + person.lastname;
        }
      }
    }

    return result;
  }

  getMainAddress(data) {
    // data - mainRelated
    const address = (data && data.whereabout && data.whereabout.address) ? data.whereabout.address : null;

    return address;
  }

  getMainAddressHtml(data) {
    // data - mainRelated
    const address = (data && data.whereabout && data.whereabout.address) ? data.whereabout.address : null;
    let result = '';
    if (address) {
      result = '<a href="https://maps.google.com/?q=' + address.body + '" target="_new"><address class="mb-0">';
      result += address.q_meta.address;
      result += address.q_meta.zip ? '<br>' + address.q_meta.zip : '';
      result += address.q_meta.city ? ' ' + address.q_meta.city : '';
      result += address.q_meta.province ? ' (' + address.q_meta.province + ')' : '';
      result += address.q_meta.state ? '<br>' + address.q_meta.state : '';
      result += '</address></a>';
    }

    return result;
  }

  // Whereabouts

  getRelatedBodyByType(type, data) {
    let result = data.body;
    switch (type) {
      case 'address':
        result = data.q_meta.address;
        result += data.q_meta.zip ? ' ' + data.q_meta.zip : '';
        result += data.q_meta.city ? ' ' + data.q_meta.city : '';
        result += data.q_meta.province ? ' (' + data.q_meta.province + ')' : '';
        result += data.q_meta.state ? ' ' + data.q_meta.state : '';
        break;
      case 'phone':
        result = data.q_meta.phone;
        break;
      case 'mobile':
        result = data.q_meta.phone;
        break;
      case 'email':
        result = data.q_meta.email;
        break;
      case 'pec':
        result = data.q_meta.email;
        break;
      case 'website':
        result = data.q_meta.www;
        break;
    }
    return result;
  }

  getWhereaboutType(type, data, html = true) {
    let result = '---';

    const main = data;
    let wa = null;

    switch (type) {
      case 'address':
        wa = (main && main.whereabout && main.whereabout[type]) ? main.whereabout[type] : null;
        if (html) {
          result = this.getMainAddressHtml(main);
        } else {
          if (wa) {
            result = wa.body;
          }
        }
      break;
      case 'phone':
      case 'mobile':
      case 'email':
      case 'pec':
        wa = (main && main.whereabout && main.whereabout[type]) ? main.whereabout[type] : null;
        if (wa) {
          if (html) {
            result = '<span class="badge badge-light">' + wa.label + '</span>' + ' <span>' + wa.body + '</span>';
          } else {
            result = wa.body;
          }
        }
        break;

      case 'website':
        wa = (main && main.whereabout && main.whereabout[type]) ? main.whereabout[type] : null;
        if (wa) {
          if (html) {
            result = '<a href="' + wa.body + '" target="_new">';
            result += '<span class="badge badge-light">' + wa.label + '</span>' + ' <span>' + wa.body + '</span></a>';
          } else {
            result = wa.body;
          }
        }
        break;
    }

    return result;
  }

  hasValue(elements, value) {
    if (elements.findIndex(x => x.name === value) > -1) {
      return true;
    }
    return false;
  }

  hasValueString(element, value) {
    if (element && element.search(value) > -1) {
      return true;
    }
    return false;
  }

  getContactTypeIcon(type) {
    let result = '';

    switch (type) {
      case 'Agente':
        result = '<i class="cui-user text-warning"></i></span>';
        break;
      case 'Cliente':
        result = '<i class="cui-euro text-danger"></i>';
        break;
      case 'Fornitore':
        result = '<i class="cui-factory text-info"></i>';
        break;
      case 'Unita':
        result = '<i class="cui-boat-alt text-indigo"></i>';
        break;
      case 'Vettore':
        result = '<i class="cui-truck text-warning"></i>';
        break;
    }

    return result;
  }

  // Diff

  objectsDiff(obj1, obj2, exclude = null) {
    const r = {};

    if (!exclude) { exclude = []; }

    for (const prop in obj1) {
      if (obj1.hasOwnProperty(prop) && prop !== '__proto__') {
        if (exclude.indexOf(obj1[prop]) === -1) {
          // check if obj2 has prop
          if (!obj2.hasOwnProperty(prop)) {
            r[prop] = obj1[prop];
          } else if (obj1[prop] === Object(obj1[prop])) {
            const difference = this.objectsDiff(obj1[prop], obj2[prop]);
            if (Object.keys(difference).length > 0) { r[prop] = difference; }
          } else if (obj1[prop] !== obj2[prop]) {
            if (obj1[prop] === undefined) { r[prop] = 'undefined'; }
            if (obj1[prop] === null) {
              r[prop] = null;
            } else if (typeof obj1[prop] === 'function') {
              r[prop] = 'function';
            } else if (typeof obj1[prop] === 'object') {
              r[prop] = 'object';
            } else {
              r[prop] = obj1[prop];
            }
          }
        }
      }
    }

    return r;
  }

  // TEST
  modifiedModelTest(obj1, obj2) {

    function deepDiff(a, b, r, reversible) {
      _.each(a, function (v, k) {
        // already checked this or equal...
        if (r.hasOwnProperty(k) || b[k] === v) { return; }
        // but what if it returns an empty object? still attach?
        r[k] = _.isObject(v) ? _.diff(v, b[k], reversible) : v;
      });
    }

    /* the function */
    _.mixin({
      shallowDiff: function (a, b) {
        return _.omit(a, function (v, k) {
          return b[k] === v;
        });
      },
      diff: function (a, b, reversible) {
        const r = {};
        deepDiff(a, b, r, reversible);
        if (reversible) { deepDiff(b, a, r, reversible); }
        return r;
      }
    });

    function compareValue(val1, val2) {
      let isSame = true;
      for (const p in val1) {
        if (typeof val1[p] === 'object') {
          const objectValue1 = val1[p],
            objectValue2 = val2[p];
          // tslint:disable-next-line:forin
          for (const value in objectValue1) {
            isSame = compareValue(objectValue1[value], objectValue2[value]);
            if (isSame === false) {
              return false;
            }
          }
        } else {
          if (val1 !== val2) {
            isSame = false;
          }
        }
      }
      return isSame;
    }

    // console.group('Objects');
    // console.log('obj1', obj1);
    // console.log('obj2', obj2);
    // console.groupEnd();
    const diffParams = {};
    for (const p in obj1) {
      if (!compareValue(obj1[p], obj2[p])) {
        diffParams[p] = obj1[p];
      }
    }
    // console.log('modifiedModel', diffParams);

    // console.log('modifiedModel 2', _.diff(obj1, obj2));

    // Get updated values (including new values)
    const updatedValuesIncl = _.omitBy(obj1, (value, key) => _.isEqual(obj2[key], value));
    // console.log('updatedValuesIncl', updatedValuesIncl);

    // Get updated values (excluding new values)
    const updatedValuesExcl = _.omitBy(obj1, (value, key) => (!_.has(obj2, key) || _.isEqual(obj2[key], value)));
    // console.log('updatedValuesExcl', updatedValuesIncl);

    // Get old values (by using updated values)
    const oldValues = Object.keys(updatedValuesIncl).reduce((acc, key) => { acc[key] = obj2[key]; return acc; }, {});
    // console.log('oldValues', updatedValuesIncl);

    // Get newly added values
    const newCreatedValues = _.omitBy(obj1, (value, key) => _.has(obj2, key));
    // console.log('newCreatedValues', updatedValuesIncl);

    // Get removed values
    const deletedValues = _.omitBy(obj2, (value, key) => _.has(obj1, key));
    // console.log('deletedValues', updatedValuesIncl);

    const difference = this.objectsDiff(obj1, obj2);
    // console.log('difference', difference, !_.isEmpty(difference));
  }

  // Ag-Grid

  setGrdiApi(gridApi) {
    // this.gridApi = gridApi;
  }

  localeTextFunc(key, defaultValue) {
    let gridKey = 'APP.FIELD.' + key;

    let value = this.translate.instant(gridKey);
    if (value === gridKey ? defaultValue : value) {
      gridKey = 'APP.AGGRID.' + key;
      value = this.translate.instant(gridKey);
      return value === gridKey ? defaultValue : value;
    } else {
      return value;
    }
  }

  navigateToNextCell(params) {
    let previousCell = params.previousCellPosition;
    const suggestedNextCell = params.nextCellPosition;

    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;

    switch (params.key) {
      case KEY_DOWN:
        previousCell = params.previousCellPosition;
        // set selected cell on current cell + 1
        this.gridApi.forEachNode((node) => {
          if (previousCell.rowIndex + 1 === node.rowIndex) {
            node.setSelected(true);
          }
        });
        return suggestedNextCell;
      case KEY_UP:
        previousCell = params.previousCellPosition;
        // set selected cell on current cell - 1
        this.gridApi.forEachNode((node) => {
          if (previousCell.rowIndex - 1 === node.rowIndex) {
            node.setSelected(true);
          }
        });
        return suggestedNextCell;
      case KEY_LEFT:
      case KEY_RIGHT:
        return suggestedNextCell;
    }
  }

  // Tables - Anagrafiche

  getAnagrafiche(tables, anagrafiche) {
    const reqs: Observable<any>[] = [];

    tables.forEach(table => {
      anagrafiche[table] = [];
      switch (table) {
        case 'AnagMagazzino':
          this.tablesService.setSort('denominazione', 'asc');
          reqs.push(
            this.tablesService.getMagazziniAzienda(this.user.aziendaId)
              .pipe(
                catchError((err) => {
                  console.log('getAnagrafiche error', table, err);
                  return of({ items: [] });
                })
              )
          );
          break;
        case 'AnagListino':
          this.tablesService.setSort('denominazione', 'asc');
          reqs.push(
            this.tablesService.getListini()
              .pipe(
                catchError((err) => {
                  console.log('getAnagrafiche error', table, err);
                  return of({ items: [] });
                })
              )
          );
          break;
        default:
          this.tablesService.setSort('descrizione', 'asc');
          reqs.push(
            this.tablesService.getTable(table)
              .pipe(
                catchError((err) => {
                  console.log('getAnagrafiche error', table, err);
                  return of({ items: [] });
                })
              )
          );
          break;
      }
    });

    forkJoin(reqs).subscribe(
      (results: Array<any>) => {
        tables.forEach((table, index) => {
          switch (table) {
            case 'AnagMagazzino':
            case 'AnagListino':
              anagrafiche[table] = results[index]?.items ? results[index].items : results[index];
              break;
            default:
              anagrafiche[table] = results[index].items;
              break;
          }
        });
      },
      (error: any) => {
        console.log('getAnagrafiche forkJoin', error);
      }
    );
  }

  getAnagraficheCombo(tables, anagrafiche) {
    const reqs: Observable<any>[] = [];

    tables.forEach((table: any) => {
      let _table = '';
      let _aziendaId = null;
      let _param = null;
      if (typeof table === 'string') {
        _table = table;
      } else {
        _table = table.name;
        _aziendaId = table.aziendaId;
        _param = table.param;
      }
      anagrafiche[table] = [];
      switch (table) {
        default:
          this.tablesService.setSort('descrizione', 'asc');
          reqs.push(
            this.tablesService.getTableCombo(_table, _aziendaId, _param)
              .pipe(
                catchError((err) => {
                  console.log('getAnagraficheCombo error', table, err);
                  return of({ items: [] });
                })
              )
          );
      }
    });

    forkJoin(reqs).subscribe(
      (results: Array<any>) => {
        tables.forEach((table, index) => {
          const _table = (typeof table === 'string') ? table : table.name;
          switch (_table) {
            case 'SpComboAzienda':
              anagrafiche[_table] = results[index].items
                .map(item => ({
                  id: item.Id,
                  descrizione: String(item.Value),
                  pathlogo: item.FileLogo ? `${item.UrlPathLogo}${item.FileLogo}` : null
                })).sort(this._order);
              break;
            case 'SpComboMansione':
            case 'SpComboIva':
              anagrafiche[_table] = results[index].items
                .map(item => ({ id: item.Id, descrizione: String(item.Value), codice: item.Codice }))
                .sort(this._order);
              break;
            case 'SpComboDepartment':
              anagrafiche[_table] = results[index].items
                .map(item => ({ id: item.Id, descrizione: String(item.Value), categoriaDocumentoId: item.CategoriaDocumentoId }))
                .sort(this._order);
              break;
            case 'SpComboTrasportoACuraDel':
              anagrafiche[_table] = results[index].items
                .map(item => ({ id: item.Id, descrizione: String(item.Value), isVettore: item.IsVettore, portiId: item.PortiId }))
                .sort(this._order);
              break;
            case 'SpComboTipoDocumentoDiTrasporto':
              anagrafiche[_table] = results[index].items
                .map(item => ({ id: item.Id, descrizione: String(item.Value), sezionaleDefaultId: item.SezionaleDefaultId }))
                .sort(this._order);
              break;
            default:
              anagrafiche[_table] = results[index].items
                .map(item => ({ id: item.Id, descrizione: String(item.Value) }))
                .sort(this._order);
              break;
          }
        });
      },
      (error: any) => {
        console.log('getAnagraficheCombo forkJoin', error);
      }
    );
  }

  _order(a, b) {
    function _orderByComparator(a: any, b: any): number {
      if (
        isNaN(parseFloat(a)) ||
        !isFinite(a) ||
        (isNaN(parseFloat(b)) || !isFinite(b))
      ) {
        // Isn't a number so lowercase the string to properly compare
        if (a.toLowerCase() < b.toLowerCase()) { return -1; }
        if (a.toLowerCase() > b.toLowerCase()) { return 1; }
      } else {
        // Parse strings as numbers to compare properly
        if (parseFloat(a) < parseFloat(b)) { return -1; }
        if (parseFloat(a) > parseFloat(b)) { return 1; }
      }

      return 0; // equal each other
    }

    return _orderByComparator(a['descrizione'], b['descrizione']);
  }
}
