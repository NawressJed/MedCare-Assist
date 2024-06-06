import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MedicalFileDetailsComponent } from './details.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';

const detailsRoutes: Route[] = [
  {
    path: '',
    component: MedicalFileDetailsComponent
  }
];

@NgModule({
  declarations: [
    MedicalFileDetailsComponent
  ],
  imports: [
    RouterModule.forChild(detailsRoutes),
    CommonModule,
    MatIconModule,
    CdkScrollableModule,
    MatButtonModule,
  ]
})
export class DetailsModule { }
