import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Error403Component } from './error-403.component';
import { error403Routes } from './error-403.routing';

@NgModule({
    declarations: [
        Error403Component
    ],
    imports     : [
        RouterModule.forChild(error403Routes),
        TranslateModule
    ]
})
export class Error403Module
{
}
