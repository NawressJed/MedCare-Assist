import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { PastComponent } from './past.component';
import { SharedModule } from 'app/shared/shared.module';

export const routes: Route[] = [
    {
        path     : '',
        component: PastComponent
    }
];

@NgModule({
    declarations: [
        PastComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatIconModule,
        SharedModule
    ],
    providers: [
        DatePipe
    ]

})
export class PastModule
{
}