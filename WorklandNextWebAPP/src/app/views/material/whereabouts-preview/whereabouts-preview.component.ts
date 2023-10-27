import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-whereabouts-preview',
  templateUrl: './whereabouts-preview.component.html',
  styleUrls: ['./whereabouts-preview.component.scss']
})
export class WhereaboutsPreviewComponent implements OnInit, OnChanges {

  @Input() mainRelated = null;
  @Input() showAvatar = false;
  @Input() showWhereabouts = true;
  @Input() showIcon = true;
  @Input() showLabel = false;
  @Input() showEdit = false;
  @Input() showDebug = false;

  @Output() changeAvatar: EventEmitter<any> = new EventEmitter<any>();

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  constructor(
    private utilsService: UtilsService
  ) {
    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.mainRelated) {
      this.mainRelated = changes.mainRelated.currentValue;
    }
    if (changes.showAvatar) {
      this.showAvatar = changes.showAvatar.currentValue;
    }
    if (changes.showWhereabouts) {
      this.showWhereabouts = changes.showWhereabouts.currentValue;
    }
  }

  getWhereabout(type) {
    return this.utilsService.getWhereaboutType(type, this.mainRelated);
  }

  getMainAvatar() {
    return (this.mainRelated && this.mainRelated.media) ? this.mainRelated.media.avatar : null;
  }

  getImage(type, asset) {
    const avatar = this.getMainAvatar();
    return this.utilsService.getMediumImage(avatar, type, asset);
  }

  onChangeAvatar() {
    this.changeAvatar.emit({});
  }
}
