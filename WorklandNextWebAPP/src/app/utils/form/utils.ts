import {
  AbstractControl,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function keys<T>(x: T): Array<keyof T> {
  return x ? Object.keys(x) as Array<keyof T> : [];
}

export function markAllAsTouched(x: AbstractControl, onlySelf = false) {
  if (x instanceof FormGroup) {
    for (const name of Object.keys(x.controls)) {
      markAllAsTouched(x.controls[name], true);
    }
  } else if (x instanceof FormArray) {
    for (const c of x.controls) {
      markAllAsTouched(c, true);
    }
  }
  x.markAsTouched({ onlySelf });
}

export function markAllAsUntouched(x: AbstractControl, onlySelf = false) {
  if (x instanceof FormGroup) {
    for (const name of Object.keys(x.controls)) {
      markAllAsUntouched(x.controls[name], true);
    }
  } else if (x instanceof FormArray) {
    for (const c of x.controls) {
      markAllAsUntouched(c, true);
    }
  }
  x.markAsUntouched({ onlySelf });
}
