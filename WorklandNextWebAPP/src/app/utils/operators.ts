import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function inputIsNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

export function isNotNullOrUndefined<T>() {
  return (source$: Observable<null | undefined | T>) =>
    source$.pipe(
      filter(inputIsNotNullOrUndefined),
    );
}

export function isArrayNotEmpty<T>() {
  return (source$: Observable<T[]>) =>
    source$.pipe(
      filter((input) => input.length > 0),
    );
}
