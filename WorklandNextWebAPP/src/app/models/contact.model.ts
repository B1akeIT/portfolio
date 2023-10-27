import { Validators } from '@angular/forms';

import { FormlyFieldConfig } from '@ngx-formly/core';

import { ValidationService } from '@app/extensions/formly/validation.service';

export class Contact {
  id: number = 0;
  nome: string;
  cognome: string;
  ragioneSociale: string;
  nickName: string;
  mansioniContatto: string;
  pIva: string;
  codiceFiscale: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  anagNazioneId: number;
  email: string;
  nTel: string;
  nCell: string;
  nFax: string;
  pec: string;
  numeroIscrizREA: string;
  codiceAttivitaISTAT: string;
  legaleRappresentante: string;
  anagValutaId: number;
  sitoWeb: string;
  assistenza: string;
  anagValutazioneId: number;
  anagLinguaId: number;
  anagOrigineContattoId: number;

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
        ]
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
        key: 'ragioneSociale',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.ragioneSociale',
          placeholder: 'APP.FIELD.ragioneSociale',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'pIva',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.pIva',
          placeholder: 'APP.FIELD.pIva',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'codiceFiscale',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceFiscale',
          placeholder: 'APP.FIELD.codiceFiscale',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'indirizzoSede',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.indirizzoSede',
          placeholder: 'APP.FIELD.indirizzoSede',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'comuneSede',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.comuneSede',
          placeholder: 'APP.FIELD.comuneSede',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'capSede',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.capSede',
          placeholder: 'APP.FIELD.capSede',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'provinciaSede',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.provinciaSede',
          placeholder: 'APP.FIELD.provinciaSede',
          required: true,
          appearance: 'legacy'
        }
      },
      {
        key: 'anagNazioneId',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagNazioneId',
          placeholder: 'APP.FIELD.anagNazioneId',
          required: true,
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
        key: 'pec',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'email',
          translate: true,
          label: 'APP.FIELD.pec',
          placeholder: 'APP.FIELD.pec',
          required: true,
          appearance: 'legacy'
        },
        validators: {
          validation: [ValidationService.emailValidator]
        }
      },
      {
        key: 'nTel',
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
        key: 'nCell',
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
        key: 'nFax',
        type: 'input',
        defaultValue: '',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.fax',
          placeholder: 'APP.FIELD.fax',
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
      }
    ];
  }

  formFieldsOptions() {
    return {
      id: {},
      nome: {},
      cognome: {},
      ragioneSociale: {},
      nickName: {},
      mansioniContatto: {},
      pIva: {},
      codiceFiscale: {},
      indirizzoSede: {},
      comuneSede: {},
      capSede: {},
      provinciaSede: {},
      anagNazioneId: {},
      email: {},
      nTel: {},
      nCell: {},
      nFax: {},
      pec: {},
      numeroIscrizREA: {},
      codiceAttivitaISTAT: {},
      legaleRappresentante: {},
      anagValutaId: {},
      sitoWeb: {},
      assistenza: {},
      anagValutazioneId: {},
      anagLinguaId: {},
      anagOrigineContattoId: {}
    };
  }
}
