import { Component, OnInit, Input, OnChanges }	from '@angular/core';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

import { UtilsService } from '@app/services/utils.service';

@Component({
  selector: 'app-contact-inspector',
  templateUrl: './contact-inspector.component.html',
  styleUrls: ['./contact-inspector.component.scss']
})
export class ContactInspectorComponent implements OnInit, OnChanges {

  @Input() contact = null;
  @Input() contactId = 0;
  @Input() showNewCard = false;

  loading = false;
  modified = false;

  fields = [
    // 'avatar',
    'id',
    'uid',
    // 'firstname',
    // 'lastname',
    // 'companyname',
    'created_at',
    'updated_at',
    'q_meta',
    'attachments',
    'whereabouts',
    'q_import_data_2_fix'
  ];

  customFields = [
    'avatar',
    'q_active',
    'q_meta',
    'debut',
    'custom',
    'attachments',
    'whereabouts',
    'q_import_data_2_fix'
  ];

  objectKeys = Object.keys;

  avatar = null;
  imageLoader = true;

  mainRelated = null;

  options: AnimationOptions = {
    path: '/assets/animations/finger-click.json',
    loop: false
  };

  constructor(
    private utilsService: UtilsService
  ) { }

  ngOnChanges(changes: any) {
    if ( changes.contact ) {
      this.contact = changes.contact.currentValue;
      this.loadUser();
      if ( changes.contactId ) {
        this.contactId = changes.contactId.currentValue;
        // this.loadUser();
      }
    }
  }

  animationCreated(animationItem: AnimationItem): void {
    // console.log(animationItem);
  }

  loadUser() {
    this.loading = true;
    this.avatar = this.utilsService.getMainAvatar(this.contact);
    this.mainRelated = (this.contact) ? this.contact.q_main : null;
    this.loading = false;
  }

  ngOnInit() {
    // this.loadUser();
  }

  isCustomFields(field) {
    // check if field is custom
    return (this.customFields.indexOf(field) !== -1);
  }

  getImage(medium, type, asset) {
    return this.utilsService.getMediumImage(medium, type, asset);
  }

  getWhereaboutType(type, html) {
    return this.utilsService.getWhereaboutType(type, this.mainRelated, html);
  }

  getPersonName(html) {
    return this.utilsService.getPersonName(this.contact, html);
  }
}
