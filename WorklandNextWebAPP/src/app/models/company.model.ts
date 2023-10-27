import { FormlyFieldConfig } from '@ngx-formly/core';

import { Contact } from './contact.model';

export class Company {
  id: number = 0;
  aziendaId: number = 0;
  contattoId: number = 0;
  ragioneSociale: string = "";
  contatto: Contact = new Contact({});
  magazzinoList = [];
  filialiList = [];
  aliquotaIVADefaultId: number = 0;
  anagIvaAliquota: number = 0;
  anagIvaCodice: string = "";
  anagIvaDescrizione: string = "";
  logo: string = "";
  urlPathLogo: string = "";
  fileLogo: string = "";
  isDefaultValue: boolean = false;
  dataInsert: string = "";
  dataUpdate: string = "";
  dataDelete: string = "";
  utenteInsertId: number = 0;
  utenteUpdateId: number = 0;
  utenteDeleteId: number = 0;

constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
  }

  formField() {
    return <FormlyFieldConfig[]>[];
  }
}
