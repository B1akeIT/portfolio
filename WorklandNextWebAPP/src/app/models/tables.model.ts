import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { FormlyFieldConfig } from '@ngx-formly/core';

export class Iva {
  id: number = 0;
  codice: string;
  codiceGestionale: string;
  aliquota: number;
  percentualeImponibile: number;
  bolliSuEsenti: number;
  descrizione: string;
  isDefault: boolean = false;
  aziendaId: number;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
          required: false
        }
      },
      {
        key: 'codiceGestionale',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder: 'APP.FIELD.codiceGestionale',
          required: false
        }
      },
      {
        key: 'aliquota',
        type: 'input',
        templateOptions: {
          type: 'number',
          translate: true,
          label: 'APP.FIELD.aliquota',
          placeholder: 'APP.FIELD.aliquota',
          required: false
        }
      },
      {
        key: 'percentualeImponibile',
        type: 'input',
        templateOptions: {
          type: 'number',
          translate: true,
          label: 'APP.FIELD.percentualeImponibile',
          placeholder: 'APP.FIELD.percentualeImponibile',
          required: false
        }
      },
      {
        key: 'bolliSuEsenti',
        type: 'input',
        templateOptions: {
          type: 'number',
          translate: true,
          label: 'APP.FIELD.bolliSuEsenti',
          placeholder: 'APP.FIELD.bolliSuEsenti',
          required: false
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
          required: false
        }
      },
      {
        key: 'isDefault',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefault',
          placeholder: 'APP.FIELD.isDefault',
          required: false
        }
      },
    ];
  }
}

export class ModalitaPagamento {
  id: number = 0;
  codice: number;
  descrizione: string;
  speseIncasso: number;
  isDefault: boolean;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: string;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
          required: false
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
          required: false
        }
      },
      {
        key: 'speseIncasso',
        type: 'input',
        templateOptions: {
          type: 'number',
          translate: true,
          label: 'APP.FIELD.speseIncasso',
          placeholder: 'APP.FIELD.speseIncasso',
          required: false
        }
      },
      {
        key: 'isDefault',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefault',
          placeholder: 'APP.FIELD.isDefault',
          required: false
        }
      },
    ];
  }
}

export class Nazione {
  id: number = 0;
  codice: string;
  codiceGestionale: string;
  descrizione: string;
  valutaDto: string;
  lunghezzaPIVA: number;
  isBlackList: boolean = false;
  isComunitario: boolean = false;
  isDefaultValue: boolean = false;
  anagValutaID: number;
  dataIngressoCee: string;
  dataUscitaCee: string;
  dataIngressoBlackList: string;
  dataUscitaBlackList: string;
  dataInsert: string;
  dataUpdate: string;
  dataDelete: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
          required: false
        }
      },
      {
        key: 'codiceGestionale',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder: 'APP.FIELD.codiceGestionale',
          required: false
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
          required: false
        }
      },
      {
        key: 'valutaDto',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.valutaDto',
          placeholder: 'APP.FIELD.valutaDto',
          required: false
        }
      },
      {
        key: 'lunghezzaPIVA',
        type: 'input',
        templateOptions: {
          type: 'number',
          translate: true,
          label: 'APP.FIELD.lunghezzaPIVA',
          placeholder: 'APP.FIELD.lunghezzaPIVA',
          required: false
        }
      },
      {
        key: 'isBlackList',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isBlackList',
          placeholder: 'APP.FIELD.isBlackList',
          required: false
        }
      },
      {
        key: 'isComunitario',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isComunitario',
          placeholder: 'APP.FIELD.isComunitario',
          required: false
        }
      },
      {
        key: 'isDefaultValue',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
          required: false
        }
      },
    ];
  }
}

export class TipoPagamento {
  id: number = 0;
  codice: string;
  descrizione: string;
  isDefault: boolean;
  speseIncassoPerc: number;
  anagModalitaPagamentoId: number;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
          required: false
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
          required: false
        }
      },
      {
        key: 'speseIncassoPerc',
        type: 'input',
        templateOptions: {
          type: 'number',
          translate: true,
          label: 'APP.FIELD.speseIncassoPerc',
          placeholder: 'APP.FIELD.speseIncassoPerc',
          required: false
        }
      },
    ];
  }
}

export class Valuta {
  id: number = 0;
  codiceGestionale: string;
  descrizione: string;
  simbolo: string;
  isEuro: boolean;
  isDefaultValue: boolean;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'simbolo',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.simbolo',
          placeholder: 'APP.FIELD.simbolo',
        }
      },
      {
        key: 'isEuro',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isEuro',
          placeholder: 'APP.FIELD.isEuro',
        }
      },
      {
        key: 'isDefaultValue',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      }
    ];
  }
}

export class Ruolo {
  id: number = 0;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[];
  }
}

export class ShipType {
  id: number = 0;
  codice: string;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      }
    ];
  }
}

export class Shipyard {
  id: number = 0;
  codice: string;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField() {
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      }
    ];
  }
}
export class Abi{
  id: number = 0;
  codice: string;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      }
    ];
  }


}

export class AspettoEsterioreArticolo{
  id: number = 0;
  descrizione: string;
  isDefaultValue: boolean;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDefaultValue',
        type: 'checkbox',
        templateOptions: {
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      }
    ];
  }
}

export class Cab{
  id: number = 0;
  anagAbiId: number;
  codice: string;
  descrizione: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  anagNazioneId: number;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'anagAbiId',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagAbiId',
          placeholder: 'APP.FIELD.anagAbiId',
        }
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'indirizzo',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.indirizzo',
          placeholder: 'APP.FIELD.indirizzo',
        }
      },
      {
        key: 'comune',
        type: 'input',
        templateOptions: {
          type: 'text',
          traslate: true,
          label: 'APP.FIELD.comune',
          placeholder: 'APP.FIELD.comune',
        }
      },
      {
        key: 'cap',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.cap',
          placeholder:  'APP.FIELD.cap',
        }
      },
      {
        key: 'provincia',
        type: 'input',
        templateOptions:{
          type: 'text',
          tanslate: true,
          label: 'APP.FIELD.provincia',
          placeholder: 'APP.FIELD.provincia',
        }
      },
      {
        key: 'anagNazioneId',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.anagNazioneId',
          placeholder: 'APP.FIELD.anagNazioneId',
        }
      }
    ];
  }
}

export class CategoriaAllegati{

  id: number = 0;
  descrizione: string;
  isDeafautlValue: boolean;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDeafaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label:'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      }
    ];
  }

}

export class CategoriaMerceologica{

  id: number = 0;
  descrizione: string;
  isDeafautlValue: boolean;
  codiceGestionale: string;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDeafaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label:'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      },
      {
        key: 'codiceGestionale',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder:'APP.FIELD.codiceGestionale'
        }
      }
    ];
  }

}

export class ClassificazioneArticolo{

  id: number = 0;
  descrizione: string;
  isDeafautlValue: boolean;
  codiceGestionale: string;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDeafaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label:'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      },
      {
        key: 'codiceGestionale',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder:'APP.FIELD.codiceGestionale'
        }
      }
    ];
  }

}

export class DescEmail{

  id: number = 0;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
    ];
  }

}

export class Lingua{
  id: number = 0;
  codice: string;
  descrizione: string;
  culture: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'culture',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.culture',
          placeholder:'APP.FIELD.culture',
        }
      }
    ];
  }


}

export class OrigineContatto{
  id: number = 0;
  codice: string;
  descrizione: string;
  isDeafaultValue: boolean;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDefaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label: 'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      }
    ];
  }


}

export class Porto{
  id: number = 0;
  codice: string;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      }
    ];
  }


}

export class TipoCliente{
  id: number = 0;
  codice: string;
  descrizione: string;
  dataDelete: string;
  dataInsert: string;
  dataUpdate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return <FormlyFieldConfig[]>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      }
    ];
  }


}

export class TipoProdotto{

  id: number = 0;
  descrizione: string;
  isDeafautlValue: boolean;
  codiceGestionale: string;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDeafaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label:'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      },
      {
        key: 'codiceGestionale',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder:'APP.FIELD.codiceGestionale'
        }
      }
    ];
  }

}

export class UnitaDiMisura{

  id: number = 0;
  codice: string;
  descrizione: string;
  codiceGestionale: string;
  isDeafautlValue: boolean;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'codiceGestionale',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codiceGestionale',
          placeholder:'APP.FIELD.codiceGestionale',
        }
      },
      {
        key: 'isDeafaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label:'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      },
    ];
  }

}

export class Valutazione{

  id: number = 0;
  codice: string;
  descrizione: string;
  isDeafautlValue: boolean;
  colore: string;
  dataDelete: string;
  dataInsert: string;
  dataUpadate: string;
  utenteDeleteId: number;
  utenteInsertId: number;
  utenteUpdateId: number;

  constructor(data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key];
      });
    }
  }

  formField(){
    return<FormlyFieldConfig>[
      {
        key: 'id',
        type: 'input',
        templateOptions: {
          type: 'text',
          translate: true,
          label: 'APP.FIELD.id',
          placeholder: 'APP.FIELD.id',
          disabled: true,
          readonly: true
        },
        hide: true
      },
      {
        key: 'codice',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.codice',
          placeholder: 'APP.FIELD.codice',
        }
      },
      {
        key: 'descrizione',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.descrizione',
          placeholder: 'APP.FIELD.descrizione',
        }
      },
      {
        key: 'isDeafaultValue',
        type: 'checkbox',
        templateOptions:{
          type: 'boolean',
          translate: true,
          label:'APP.FIELD.isDefaultValue',
          placeholder: 'APP.FIELD.isDefaultValue',
        }
      },
      {
        key: 'colore',
        type: 'input',
        templateOptions:{
          type: 'text',
          translate: true,
          label: 'APP.FIELD.colore',
          placeholder: 'APP.FIELD.colore',
        }
      }
    ];
  }

}

export const Tables: any = {
  Iva,
  ModalitaPagamento,
  Nazione,
  TipoPagamento,
  Valuta,
  Ruolo,
  ShipType,
  Shipyard,
  Abi,
  AspettoEsterioreArticolo,
  Cab,
  CategoriaAllegati,
  CategoriaMerceologica,
  ClassificazioneArticolo,
  DescEmail,
  Lingua,
  OrigineContatto,
  Porto,
  TipoCliente,
  TipoProdotto,
  UnitaDiMisura,
  Valutazione
};

export class DynamicClass {
  constructor(className: string, data: any) {
    if (Tables[className] === undefined || Tables[className] === null) {
      throw new Error(`Class type of \'${className}\' is not in the tables`);
    }
    return new Tables[className](data);
  }
}
