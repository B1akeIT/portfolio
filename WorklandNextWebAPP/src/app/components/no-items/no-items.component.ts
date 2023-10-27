import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'ui-no-items',
  styleUrls: ['./no-items.component.scss'],
  templateUrl: './no-items.component.html',
})
export class NoItemsComponent {
  @Input() message = 'Nessun elemento';

  sizePx = '24px';
  /** The size in pixel for font, height and width */
  @Input() set size(v: number) {
    if (v) {
      this.sizePx = v + 'px';
    }
  }
}
