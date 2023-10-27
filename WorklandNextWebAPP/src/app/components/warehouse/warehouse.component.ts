import { Component, Input, Output, EventEmitter, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

import { Warehouse } from '@app/models/warehouse.model';
import { WarehouseService } from './warehouse.service';
import { TablesService } from '@app/views/tables/tables.service';
import { GridUtils } from '@app/utils/grid-utils';

import { APP_CONST } from '@app/shared';

import * as _ from 'lodash';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: [ './warehouse.component.scss' ]
})
export class WarehouseComponent implements OnInit, OnChanges {

  @Input() tenant = null;
  @Input() aziendaId = 0;
  @Input() warehouse = null;
  @Input() view = false;
  @Input() showMap = true;
  @Input() edit = false;
  @Input() class = '';

  @Output()
  close: EventEmitter<any> = new EventEmitter<any>();

  expanded = false;

  loading = false;
  loading_saving = false;

  loadingOptions = APP_CONST.loadingOptions;

  error = false;
  errorMessage = '';

  data = {
    id: 0,
    aziendaId: 0,
    denominazione: '',
    indirizzo: '',
    comune: '',
    cap: '',
    provincia: '',
    anagNazioneId: null,
    email: '',
    nTel: '',
    nCell: '',
    nFax: ''
  };
  dataForm: FormGroup;
  dataModel: Warehouse;
  dataFields: Array<FormlyFieldConfig>;
  optionsForm: FormlyFormOptions;

  fieldExcluded = APP_CONST.fieldExcluded;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 18;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    controlSize: 24,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap'
  };

  nations = [];

  @ViewChild('myAccordion')
  myAccordion: ElementRef;

  constructor(
    private element: ElementRef,
    private warehouseService: WarehouseService,
    private tablesService: TablesService,
    public gridUtils: GridUtils
  ) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(x => {
      this.center = {
        lat: x.coords.latitude,
        lng: x.coords.longitude
      };
    });

    this.initForm();

    this.tablesService.setPerPage(0);
    this.tablesService.setTenent(this.tenant);
    this.tablesService.setSort('descrizione', 'ASC');
    this.tablesService.getTable('AnagNazione').subscribe(
      (resp: any) => {
        this.nations = resp.items;
        this.initData();
      }
    );
  }

  ngOnChanges(changes: any) {
    if (changes.tenant) {
      this.tenant = changes.tenant.currentValue;
      this.warehouseService.setTenent(this.tenant);
    }
    if (changes.warehouse) {
      this.warehouse = this.gridUtils.renameJson(changes.warehouse.currentValue);
      // this.warehouse = changes.warehouse.currentValue;
      // this.loadWarehouse();
    }
    if (changes.class) {
      this.class = changes.class.currentValue;
    }
  }

  getDimensions() {
    // console.log('getDimensions', this.myAccordion);
    return { width: this.element.nativeElement.offsetWidth, height: this.element.nativeElement.offsetHeight };
  }

  isSmallView() {
    const dimension = this.getDimensions();
    // console.log('isSmallView', dimension);
    return !this.showMap; // || (dimension.width <= 768);
  }

  initForm() {
    this.dataForm = new FormGroup({});
  }

  initData() {
    this.dataModel = new Warehouse({});
    this.dataModel.aziendaId = this.aziendaId;

    const modifiedFields = [
      {
        name: 'anagNazioneId',
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'anagNazioneId',
            type: 'select',
            templateOptions: {
              translate: true,
              label: 'APP.FIELD.anagNazioneId',
              placeholder: 'APP.FIELD.anagNazioneId',
              options: this.nations,
              valueProp: 'id',
              labelProp: 'nazione',
              appearance: 'legacy'
            },
          },
        ]
      }
    ];
    const additionalFields = [];
    const replacedItems = this.dataModel.formField().map(x => {
      const item = modifiedFields.find(({ name }) => name === x.name);
      return item ? item : x;
    });
    this.dataFields = [...replacedItems, ...additionalFields];

    // this.dataFields = this.getFormField(); // this.dataModel.formField();
  }

  loadWarehouse() {
    this.loading = true;
    this.warehouseService.getModel(this.warehouse.id).subscribe(
      (resp: any) => {
        this.warehouse = resp;
        this.loading = false;
      }
    );
  }

  onEdit() {
    this.dataModel = new Warehouse(this.warehouse);
    this.edit = true;
  }

  onDelete() {
    // this.edit = true;
  }

  onSave(data) {
    console.log('onSave', data);
    // Set new data returned from save
    let saveObs = null;

    this.loading_saving = true;

    if (data.id === 0) {
      saveObs = this.warehouseService.saveModel(data);
    } else {
      saveObs = this.warehouseService.updateModel(this.warehouse.id, data);
    }

    saveObs.subscribe(
      (resp: any) => {
        this.data = resp;
        this.warehouse = resp;
        this.loading_saving = false;

        this.edit = false;
        this.expanded = true;
        this.close.emit(this.data);
      },
      (error: any) => {
        this.loading_saving = false;
        this.error = true;
        this.errorMessage = error.message;

        this.edit = false;
        this.expanded = true;
        this.close.emit(null);
      }
    );
  }

  closeEdit() {
    this.edit = false;
    this.expanded = true;
    this.close.emit(null);
  }

  getFormField() {
    return <FormlyFieldConfig[]>[
      // {
      //   fieldGroupClassName: 'row',
      //   fieldGroup: [
      //     {
      //       className: 'col-6',
      //       key: 'id',
      //       type: 'input',
      //       templateOptions: {
      //         type: 'text',
      //         translate: true,
      //         label: 'APP.FIELD.id',
      //         placeholder: 'APP.FIELD.id',
      //         disabled: true,
      //         readonly: true
      //       }
      //     },
      //     {
      //       className: 'col-6',
      //       key: 'aziendaId',
      //       type: 'input',
      //       templateOptions: {
      //         type: 'text',
      //         translate: true,
      //         label: 'APP.FIELD.aziendaId',
      //         placeholder: 'APP.FIELD.aziendaId',
      //         required: false,
      //         disabled: true,
      //         readonly: true
      //       }
      //     },
      //   ]
      // },
      {
        key: 'denominazione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.denominazione',
          placeholder: 'APP.FIELD.denominazione',
          required: true
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-12',
            key: 'indirizzo',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.indirizzo',
              placeholder: 'APP.FIELD.indirizzo',
              required: true
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-2',
            key: 'cap',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.cap',
              placeholder: 'APP.FIELD.cap',
              required: false
            }
          },
          {
            className: 'col-8',
            key: 'comune',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.comune',
              placeholder: 'APP.FIELD.comune',
              required: true
            }
          },
          {
            className: 'col-2',
            key: 'provincia',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.provincia',
              placeholder: 'APP.FIELD.provincia',
              required: false
            }
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'anagNazioneId',
            type: 'select',
            templateOptions: {
              translate: true,
              label: 'APP.FIELD.anagNazioneId',
              placeholder: 'APP.FIELD.anagNazioneId',
              options: this.nations,
              valueProp: 'id',
              labelProp: 'nazione',
              appearance: 'legacy'
            },
          },
        ]
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.email',
          placeholder: 'APP.FIELD.email',
          required: false
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-4',
            key: 'nTel',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.nTel',
              placeholder: 'APP.FIELD.nTel',
              required: false
            }
          },
          {
            className: 'col-4',
            key: 'nCell',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.nCell',
              placeholder: 'APP.FIELD.nCell',
              required: false
            }
          },
          {
            className: 'col-4',
            key: 'nFax',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.nFax',
              placeholder: 'APP.FIELD.nFax',
              required: false
            }
          },
        ]
      }
    ];
  }
}
