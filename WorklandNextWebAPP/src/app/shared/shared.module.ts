import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
// import { ScrollingModule } from '@angular/cdk/scrolling';
// import { NgxMaskModule, IConfig } from 'ngx-mask';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { RatingModule } from 'ngx-bootstrap/rating';
import { PaginationModule } from 'ngx-bootstrap/pagination';
// import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { FormlyFieldConfig, FormlyModule, FORMLY_CONFIG } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { NgSelectModule } from '@ng-select/ng-select';

import { registerTranslateExtension } from '@app/extensions/formly/translate.extension';

// import { Ng5SliderModule } from 'ng5-slider';

// import { ChartsModule } from 'ng2-charts/ng2-charts';
// import { ChartsModule } from 'ng2-charts-x';

// import { SimpleNotificationsModule } from 'angular2-notifications';

import { MomentModule } from 'ngx-moment';

import { AgGridModule } from 'ag-grid-angular';
// import { AngularSlickgridModule } from 'angular-slickgrid';
// import { DragToSelectModule } from 'ngx-drag-to-select';
import { NgxLoadingModule } from 'ngx-loading';
// import { NgSelectModule } from '@ng-select/ng-select';
import { NgJsonEditorModule } from 'ang-jsoneditor';
// import { BootstrapModalModule } from 'ngx-bootstrap-modal';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';

import { LottieModule } from 'ngx-lottie';
import { ResizableModule } from 'angular-resizable-element';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CreditCardDirectivesModule } from 'angular-cc-library';

import { GoogleMapsModule } from '@angular/google-maps';

import { FilterTextboxModule } from '@app/components/filter-textbox/filter-textbox.module';
import { DateRangeModule } from '@app/components/date-range/date-range.module';
import { SortingModule } from '@app/components/sorting/sorting.module';
import { HelpModule } from '@app/components/help/help.module';
// import { ReadMoreModule } from '@app/components/read-more/read-more.module';
import { ItemAttributeModule } from '@app/components/item-attribute';

import { MaterialPasswordTypeComponent } from '@app/extensions/formly/password-type-componet';

// export let options: Partial<IConfig> | (() => Partial<IConfig>);

// @dynamic
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ScrollingModule,
    // NgxMaskModule.forRoot(options),
    TranslateModule,

    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    RatingModule.forRoot(),
    PaginationModule.forRoot(),
    // TypeaheadModule.forRoot(),
    CollapseModule.forRoot(),

    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSliderModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatGridListModule,
    MatExpansionModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTableModule,
    MatBottomSheetModule,
    MatAutocompleteModule,

    FormlyModule.forRoot({
      validators: [],
      types: [
        { name: 'password', component: MaterialPasswordTypeComponent }
      ]
    }),
    // FormlyBootstrapModule,
    FormlyMaterialModule,

    NgSelectModule,

    // Ng5SliderModule,
    // SimpleNotificationsModule.forRoot(),
    MomentModule,
    AgGridModule.withComponents([]),
    // AngularSlickgridModule.forRoot(),
    // DragToSelectModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    // NgSelectModule,
    NgJsonEditorModule,
    // BootstrapModalModule.forRoot({ container: document.body }),
    NgxFilesizeModule,
    NgxPasswordToggleModule,
    LottieModule,
    ResizableModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger',
    }),

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

    GoogleMapsModule,

    FilterTextboxModule,
    DateRangeModule,
    SortingModule,
    HelpModule,
    // ReadMoreModule,
    ItemAttributeModule
  ],
  declarations: [
    // Declarations
    MaterialPasswordTypeComponent
  ],
  providers: [
    // GoogleMapsAPIWrapper
    { provide: FORMLY_CONFIG, multi: true, useFactory: registerTranslateExtension, deps: [TranslateService] },
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ScrollingModule,
    // NgxMaskModule,
    TranslateModule,

    BsDropdownModule,
    TabsModule,
    TooltipModule,
    PopoverModule,
    ModalModule,
    AlertModule,
    ProgressbarModule,
    ButtonsModule,
    DatepickerModule,
    BsDatepickerModule,
    TimepickerModule,
    RatingModule,
    PaginationModule,
    // TypeaheadModule,
    CollapseModule,

    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSliderModule,
    MatDatepickerModule,
    // MatNativeDateModule,
    MatGridListModule,
    MatExpansionModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTableModule,
    MatBottomSheetModule,
    MatAutocompleteModule,

    FormlyModule,
    // FormlyBootstrapModule,
    FormlyMaterialModule,

    NgSelectModule,

    // Ng5SliderModule,
    // ChartsModule,
    // SimpleNotificationsModule,
    MomentModule,
    AgGridModule,
    // AngularSlickgridModule,
    // DragToSelectModule,
    NgxLoadingModule,
    // NgSelectModule,
    NgJsonEditorModule,
    // BootstrapModalModule,
    NgxFilesizeModule,
    NgxPasswordToggleModule,
    LottieModule,
    ResizableModule,
    ConfirmationPopoverModule,

    CalendarModule,

    GoogleMapsModule,

    CreditCardDirectivesModule,

    FilterTextboxModule,
    DateRangeModule,
    SortingModule,
    HelpModule,
    // ReadMoreModule,
    ItemAttributeModule
  ]
})
export class SharedModule { }
