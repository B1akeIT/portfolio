import { Directive } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[trimInput]' })
export class TrimInputDirective {
  constructor(private ngControl: NgControl) {
    trimValueAccessor(ngControl.valueAccessor);
  }
}

function trimValueAccessor(valueAccessor: ControlValueAccessor) {
  const original = valueAccessor.registerOnChange;

  valueAccessor.registerOnChange = (fn: (_: unknown) => void) => {
    return original.call(valueAccessor, (value: unknown) => {
      console.log('trimInput', value);
      return fn(typeof value === 'string' ? value.trim() : value);
    });
  };
}

// https://netbasal.com/how-to-trim-the-value-of-angulars-form-control-87660941e6cb
