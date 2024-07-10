import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalendarComponent } from './calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AddComponent } from './add/add.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { UpdateComponent } from './update/update.component';

const calendarRoutes: Route[] = [
  {
    path: '',
    component: CalendarComponent
  }
];

@NgModule({
  declarations: [
    CalendarComponent,
    AddComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(calendarRoutes),
    MatButtonModule,
    MatDividerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatTooltipModule,
    FuseCardModule,
    SharedModule,
    FuseConfirmationModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    TranslateModule,
    FuseAlertModule,
    MatSlideToggleModule,
    FullCalendarModule,
    MatCheckboxModule
  ],
  exports: [
    CalendarComponent,
    TranslateModule
  ],
  providers: [
    DatePipe,
      {
          provide : MAT_DATE_FORMATS,
          useValue: {
              parse  : {
                  dateInput: moment.ISO_8601
              },
              display: {
                  dateInput         : 'll',
                  monthYearLabel    : 'MMM YYYY',
                  dateA11yLabel     : 'LL',
                  monthYearA11yLabel: 'MMMM YYYY'
              }
          }
      }
  ]
})
export class CalendarModule { }
