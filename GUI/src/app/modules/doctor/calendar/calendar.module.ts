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

const calendarRoutes: Route[] = [
  {
    path: '',
    component: CalendarComponent
  }
];

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(calendarRoutes),
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
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
    DatePipe
  ]
})
export class CalendarModule { }
