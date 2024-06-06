import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'app/shared/shared.module';
import { AddComponent } from './add.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { TranslateModule } from '@ngx-translate/core';
import { CanDeactivateGuardService } from 'app/can-deactivate-guard.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';

const addRoutes: Route[] = [
    {
        path: '',
        component: AddComponent,
        canDeactivate: [CanDeactivateGuardService]
    }
];

@NgModule({
    declarations: [
        AddComponent,
    ],
    imports: [
        RouterModule.forChild(addRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        MatTabsModule,
        MatCheckboxModule,
        MatStepperModule,
        SharedModule,
        FuseAlertModule,
        TranslateModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        SharedModule,
        MatAutocompleteModule
    ],
    exports: [
        AddComponent,
        TranslateModule
    ],
    providers: [
        CanDeactivateGuardService
    ]
})
export class AddModule {
}
