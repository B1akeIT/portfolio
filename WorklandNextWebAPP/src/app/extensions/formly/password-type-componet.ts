import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from '@ngx-formly/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'formly-password-type',
  template: `
    <mat-form-field
      [hideRequiredMarker]="true"
      [floatLabel]="to.floatLabel"
      [appearance]="to.appearance"
      [color]="to.color"
      [style.width]="'100%'">

      <mat-label *ngIf="to.label && to.hideLabel !== true">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true" class="mat-form-field-required-marker">*</span>
      </mat-label>

      <input matInput #passwordField
        [id]="id"
        type="password"
        [readonly]="to.readonly"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [tabindex]="to.tabindex || 0"
        [placeholder]="to.label">

      <img matSuffix [src]="eyeUrl"
        class="toggle-password"
        (click)="showHidePassword()"
        *ngIf="!isShowedPassword()">
      <img matSuffix [src]="eyeCrossedUrl"
        class="toggle-password"
        (click)="showHidePassword()"
        *ngIf="isShowedPassword()">
      <!-- <mat-icon matSuffix
        class="toggle-password"
        (click)="showHidePassword()"
        *ngIf="!isShowedPassword()">remove_red_eye</mat-icon> -->
      <!-- <mat-icon matSuffix
        class="toggle-password"
        (click)="showHidePassword()"
        *ngIf="isShowedPassword()">close</mat-icon> -->

      <mat-icon matSuffix
        *ngIf="to.description"
        class="help-tooltip"
        matTooltip="{{to.description}}"
        matTooltipPosition="right">help</mat-icon>

      <mat-error [id]="null">
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>

      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>

    </mat-form-field>
  `,
  styles: ['.toggle-password { color: #ccc; cursor: pointer; }']
})

export class MaterialPasswordTypeComponent extends FieldType {

  eye = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ4OC44NSA0ODguODUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4OC44NSA0ODguODU7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPGc+Cgk8cGF0aCBkPSJNMjQ0LjQyNSw5OC43MjVjLTkzLjQsMC0xNzguMSw1MS4xLTI0MC42LDEzNC4xYy01LjEsNi44LTUuMSwxNi4zLDAsMjMuMWM2Mi41LDgzLjEsMTQ3LjIsMTM0LjIsMjQwLjYsMTM0LjIgICBzMTc4LjEtNTEuMSwyNDAuNi0xMzQuMWM1LjEtNi44LDUuMS0xNi4zLDAtMjMuMUM0MjIuNTI1LDE0OS44MjUsMzM3LjgyNSw5OC43MjUsMjQ0LjQyNSw5OC43MjV6IE0yNTEuMTI1LDM0Ny4wMjUgICBjLTYyLDMuOS0xMTMuMi00Ny4yLTEwOS4zLTEwOS4zYzMuMi01MS4yLDQ0LjctOTIuNyw5NS45LTk1LjljNjItMy45LDExMy4yLDQ3LjIsMTA5LjMsMTA5LjMgICBDMzQzLjcyNSwzMDIuMjI1LDMwMi4yMjUsMzQzLjcyNSwyNTEuMTI1LDM0Ny4wMjV6IE0yNDguMDI1LDI5OS42MjVjLTMzLjQsMi4xLTYxLTI1LjQtNTguOC01OC44YzEuNy0yNy42LDI0LjEtNDkuOSw1MS43LTUxLjcgICBjMzMuNC0yLjEsNjEsMjUuNCw1OC44LDU4LjhDMjk3LjkyNSwyNzUuNjI1LDI3NS41MjUsMjk3LjkyNSwyNDguMDI1LDI5OS42MjV6IiBmaWxsPSIjMDAwMDAwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==';

  eyeCrossed = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDM3OS41NjEgMzc5LjU2MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzc5LjU2MSAzNzkuNTYxOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxwYXRoIGQ9Ik0zMjAuODM4LDEyMS45MjljLTcuMzIxLTUuNjc3LTE1LjYwNC0xMS42MS0yNC42NjQtMTcuMzYyTDM0MS40OTgsNTguNmM2LjIwNC02LjI5Miw2LjEzMy0xNi40MjMtMC4xNi0yMi42MjcgIGMtNi4yOTItNi4yMDQtMTYuNDIyLTYuMTM0LTIyLjYyNiwwLjE1OUwyNjcuMTIsODguNDU2Yy0yMy4yNTMtMTEuMDE4LTQ5LjU4Ny0xOC45NjMtNzcuMTkyLTE4Ljk2M2wtMC45OTEsMC4wMDMgIGMtNTIuMjYyLDAuMzY5LTk5Ljk4MSwyOS45MzItMTMwLjgxLDU0LjY2N0MyNy42MzIsMTQ4LjYzMS0wLjA3MywxODAuMzIsMCwxOTAuNjQ5YzAuMDgyLDExLjcwMiwyNi45ODEsNDIuMjM0LDU4LjczNyw2Ni42NzEgIGM2LjY0Niw1LjExNCwxNS4wNzMsMTEuMTQ1LDI0Ljg3NSwxNy4yNDlMMzcuODcsMzIwLjk2MmMtNi4yMDQsNi4yOTItNi4xMzMsMTYuNDIzLDAuMTYsMjIuNjI3ICBjMy4xMTcsMy4wNzQsNy4xNzUsNC42MDcsMTEuMjMzLDQuNjA3YzQuMTMyLDAsOC4yNjMtMS41OTEsMTEuMzk0LTQuNzY2bDUyLjIxLTUyLjk1MWMyMi42NjYsMTAuNTM1LDQ5LjEwMSwxOC42NTEsNzYuNzUyLDE4LjY1MSAgbDEuMDA3LTAuMDAzYzU1LjUyNS0wLjM5MiwxMDUuNzc2LTMzLjU2NiwxMzAuNzg4LTUzLjMwN2MzMS42MDMtMjQuOTQyLDU4LjIzMS01Ni4wMTEsNTguMTQ4LTY3Ljg0NSAgQzM3OS40ODQsMTc2Ljk4OCwzNTIuMDQzLDE0Ni4xMjYsMzIwLjgzOCwxMjEuOTI5eiBNMTExLjMxNCwxODkuODY0Yy0wLjMwNS00My4zMzYsMzQuNTc4LTc4LjcxNCw3Ny45MTMtNzkuMDE5ICBjMTUuOTc1LTAuMTEzLDMwLjg2LDQuNTY5LDQzLjMxNCwxMi42ODFsLTEwNy45MzgsMTA5LjQ3QzExNi4zMTgsMjIwLjY1NywxMTEuNDI3LDIwNS44MzksMTExLjMxNCwxODkuODY0eiBNMTkwLjMzNCwyNjcuNzc3ICBjLTE1Ljc4NCwwLjExMS0zMC41LTQuNDYyLTQyLjg2My0xMi4zOTZsMTA3Ljc3Ny0xMDkuMzA4YzguMTA3LDEyLjI1LDEyLjg4NywyNi45LDEyLjk5OSw0Mi42ODQgIEMyNjguNTUyLDIzMi4wOTQsMjMzLjY2OSwyNjcuNDcyLDE5MC4zMzQsMjY3Ljc3N3oiIGZpbGw9IiMwMDAwMDAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==';

  eyeUrl = null;
  eyeCrossedUrl = null;

  @ViewChild('passwordField', { static: false }) passwordField;

  constructor (private _sanitizer: DomSanitizer) {
    super();
    this.eyeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.eye);
    this.eyeCrossedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.eyeCrossed);
  }

  public showHidePassword() {
    this.passwordField.nativeElement.type = this.passwordField.nativeElement.type === 'password' ? 'text' : 'password';
  }

  public isShowedPassword() {
    return (this.passwordField?.nativeElement?.type === 'text' || false);
  }
}
