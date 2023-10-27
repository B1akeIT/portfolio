import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  selector: 'ui-no-permission',
  styleUrls: ['./no-permission.component.scss'],
  templateUrl: './no-permission.component.html',
})
export class NoPermissionComponent {
  @Input() message = 'APP.MESSAGE.no-permission';

  sizePx = '24px';
  /** The size in pixel for font, height and width */
  @Input() set size(v: number) {
    if (v) {
      this.sizePx = v + 'px';
    }
  }
}
