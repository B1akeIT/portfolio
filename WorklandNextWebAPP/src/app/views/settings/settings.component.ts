import { Component, ViewChild, OnInit } from '@angular/core';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

import { OptionsService } from '@app/services/options.service';
import { AuthenticationService } from '@app/services/authentication.service';

import { APP_CONST } from '@app/shared/const';

import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  status: { isopen: boolean } = { isopen: true };

  modified = false;

  isShowedOptions = true;
  isShowedDevOptions = false;

  loading_tags = false;

  session;
  settings;

  tokenExpiredDate = null;

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;

  constructor(
    private optionsService: OptionsService,
    private auth: AuthenticationService
  ) {
    this.editorOptions = new JsonEditorOptions();
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'view'; // set only one mode
  }

  ngOnInit(): void {
    this.session = this.getSession();
    this.settings = this.optionsService.getLocalOptions();
    if (!this.settings) {
      this.optionsService.setDefaultOptions(APP_CONST.defaultLanguage);
      this.settings = this.optionsService.getLocalOptions();
    }
  }

  toggleAutosave($event) {
    this.settings.auto_save = !this.settings.auto_save;
    this.saveSettings();
  }

  optionsChange($event) {
    this.modified = true;
    if (this.settings.auto_save) {
      this.saveSettings();
    }
  }

  showOptions($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.isShowedOptions = true;
    this.isShowedDevOptions = false;
  }

  showDevOptions($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.isShowedOptions = false;
    this.isShowedDevOptions = true;
  }

  saveSettings(): void {
    this.optionsService.setOptions(this.settings);
    this.modified = false;
  }

  saveEditorData() {
    const json = this.editor.get();
    console.log('saveEditorData', json);
  }

  private getSession() {
    const token = '';
    const storage = localStorage.getItem(APP_CONST.storageSession);
    const session = JSON.parse(decodeURI(atob(storage)));

    return session;
  }

  checkToken() {
    this.tokenExpiredDate = this.auth.getTokenExpiredDate(false);
  }
}
