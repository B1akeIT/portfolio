import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

export class UserPrincipal {
  id: number = 0;
  userName: string;
  email: string;
  roleId: number;
  isActive: boolean = false;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'id',
            type: 'input',
            templateOptions: {
              type: 'text',
              translate: true,
              label: 'APP.FIELD.id',
              placeholder: 'APP.FIELD.id',
              disabled: true,
              readonly: true
            }
          },
        ]
      },
      {
        key: 'userName',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.username',
          placeholder: 'APP.FIELD.username',
          required: true
        }
      },
      {
        key: 'email',
        type: 'input',
        templateOptions: {
          type: 'email',
          translate: true,
          label: 'APP.FIELD.email',
          placeholder: 'APP.FIELD.email',
          required: false
        },
        validators: {
          validation: [ ValidationService.emailValidator ]
        }
      },
      {
        key: 'roleId',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.role',
          placeholder: 'APP.FIELD.role',
          required: false
        }
      }
    ];
  }
}

export class User {
  anagCredenzialeID: string;
  id: number = 0;
  userName: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  cellulare: string;
  departmentId: string;
  anagRuoloId: number;
  ruolo: any;
  aziendaId: number;
  anagMansioneId: number;
  magazzinoId: number;

  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'anagCredenzialeID',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagCredenzialeID',
          placeholder: 'APP.FIELD.anagCredenzialeID',
          disabled: true,
          readonly: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'id',
        type: 'input',
        defaultValue: 0,
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'userName',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.username',
          placeholder: 'APP.FIELD.username',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'nome',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.firstname',
          placeholder: 'APP.FIELD.firstname',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'cognome',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.lastname',
          placeholder: 'APP.FIELD.lastname',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'email',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'email',
          translate: true,
          label: 'APP.FIELD.email',
          placeholder: 'APP.FIELD.email',
          required: true,
          appearance: 'legacy'
        },
        validators: {
          validation: [ValidationService.emailValidator]
        }
      },
      {
        key: 'telefono',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.phone',
          placeholder: 'APP.FIELD.phone',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'cellulare',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.mobile',
          placeholder: 'APP.FIELD.mobile',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'anagRuoloId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.role',
          placeholder: 'APP.FIELD.role',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'aziendaId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.company',
          placeholder: 'APP.FIELD.company',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'departmentId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.department',
          placeholder: 'APP.FIELD.department',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'anagMansioneId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.mansioneId',
          placeholder: 'APP.FIELD.mansioneId',
          required: false,
          appearance: 'legacy'
        }
      },
      {
        key: 'magazzinoId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.magazzinoId',
          placeholder: 'APP.FIELD.magazzinoId',
          required: false,
          appearance: 'legacy'
        }
      },
    ];
  }
}
