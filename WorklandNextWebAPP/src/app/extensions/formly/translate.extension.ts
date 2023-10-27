import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

export class TranslateExtension {
  constructor(private translate: TranslateService) { }
  prePopulate(field: FormlyFieldConfig) {
    const to = field.templateOptions || {};
    if (!to.translate || to._translated) {
      return;
    }

    to._translated = true;
    field.expressionProperties = {
      ...(field.expressionProperties || {}),
      'templateOptions.label': this.translate.stream(to.label),
      'templateOptions.placeholder': this.translate.stream(to.placeholder),
    };
  }
}

export function registerTranslateExtension(translate: TranslateService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return translate.stream('APP.FORM.VALIDATION.REQUIRED');
        },
      },
      {
        name: 'email',
        message() {
          return translate.stream('APP.FORM.VALIDATION.EMAIL');
        },
      },
      {
        name: 'invalidEmailAddress',
        message() {
          return translate.stream('APP.FORM.VALIDATION.EMAIL');
        },
      },
      {
        name: 'invalidPassword',
        message() {
          return translate.stream('APP.FORM.VALIDATION.PASSWORD');
        },
      },
      {
        name: 'invalidCreditCard',
        message() {
          return translate.stream('APP.FORM.VALIDATION.CREDIT-CARD');
        },
      },
    ],
    extensions: [{
      name: 'translate',
      extension: new TranslateExtension(translate),
    }],
  };
}
