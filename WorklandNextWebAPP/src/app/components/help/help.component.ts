import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { HelpService } from '../../services/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnChanges {

  public loading = true;

  public help = null;

  @Input() chapter = ''; // poi, event, user, …
  @Input() section = ''; // sigle field or group

  objectKeys = Object.keys;

  constructor(
    private helpService: HelpService
  ) { }

  ngOnInit() {

  }

  loadHelp() {
    this.loading = true;
    this.helpService.getHelp(this.chapter)
      .subscribe(
        data => {
          this.help = data;
          this.loading = false;
        },
        err => {
          console.log(err);
          this.loading = false;
        });
    }

  ngOnChanges(changes: any) {
    if ( changes.chapter ) {
      this.chapter = changes.chapter.currentValue;
      this.loadHelp();
    }
    if (changes.section) {
      this.section = changes.section.currentValue;
    }
  }

  isDefaultSection() {
    return (this.section === 'default');
  }
}
