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
import { MatOptionModule } from '@angular/material/core';
import { FuseAlertModule } from '@fuse/components/alert';
import { TranslateModule } from '@ngx-translate/core';
import { DetailsComponent } from './details.component';

const detailsRoutes: Route[] = [
  {
    path: '',
    component: DetailsComponent
  }
];

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    RouterModule.forChild(detailsRoutes),
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
    FuseCardModule,
    MatOptionModule,
    FuseAlertModule,
    TranslateModule,
  ],
  exports: [
    DetailsComponent,
    TranslateModule
  ]
})
export class DetailsModule { }
