import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileComponent } from './profile.component';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsSecurityComponent } from './settings-security/security.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CanDeactivateGuardService } from 'app/can-deactivate-guard.service';
import { DatePipe } from '@angular/common';

export const routes: Route[] = [
    {
        path     : '',
        component: ProfileComponent,
        canDeactivate: [CanDeactivateGuardService]
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        TranslateModule,
        ScrollingModule,
    ],
    exports: [
        ProfileComponent,
        TranslateModule
    ],
    providers: [
        CanDeactivateGuardService,
        DatePipe
    ]
})
export class ProfileModule
{
}
