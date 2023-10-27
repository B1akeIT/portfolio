import { ElementRef, Injectable, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ResizeEvent } from 'angular-resizable-element';

import { OptionsService } from './options.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ResizableService {

  @ViewChild('sidebarInspector') public elemRef: ElementRef;
  // private elemRef = null;

  startWidth = 0;
  dragging = false;

  sidebarMinWidth = 250;
  sidebarMaxWidth = 800;

  constructor(
    private translate: TranslateService,
    private optionsService: OptionsService
  ) {
  }

  setElementRef(ref) {
    this.elemRef = ref;
  }

  onResizeStart(event): void {
    this.dragging = true;
    if (this.elemRef) {
      const width = window.getComputedStyle(this.elemRef.nativeElement, null).getPropertyValue('width');
      this.startWidth = parseInt(width, 10);
    }
  }

  onResizing(event): void {
    if (this.elemRef) {
      const width = window.getComputedStyle(this.elemRef.nativeElement, null).getPropertyValue('width');
      const left: any = event.edges.left;
      let newWidth = (this.startWidth - left);
      if (newWidth < this.sidebarMinWidth) { newWidth = this.sidebarMinWidth; }
      if (newWidth > this.sidebarMaxWidth) { newWidth = this.sidebarMaxWidth; }
      this.elemRef.nativeElement.style.width = newWidth + 'px';
    }
  }

  onResizeEnd(event: ResizeEvent): void {
    // if (this.validate() && this.elemRef) {
    //   const width = window.getComputedStyle(this.elemRef.nativeElement, null).getPropertyValue('width');
    //   const left: any = event.edges.left;
    //   const newWidth = (this.startWidth - left);
    //   this.elemRef.nativeElement.style.width = newWidth + 'px';
    // }
    this.dragging = false;
  }

  validate(event: ResizeEvent): boolean {
    return true;
  }
}
