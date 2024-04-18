import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthConfirmationRequiredComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';

export const routes: Route[] = [
    {
        path     : '',
        component: AuthConfirmationRequiredComponent
    }
];

@NgModule({
    declarations: [
        AuthConfirmationRequiredComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        FuseCardModule,
        SharedModule
    ]
})
export class AuthConfirmationRequiredModule
{
}
