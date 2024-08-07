import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { LayoutComponent } from 'app/layout/layout.component';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyLayoutModule } from './layouts/empty/empty.module';
import { ClassicLayoutModule } from './layouts/vertical/classic/classic.module';
import { ChatbotModule } from './common/chatbot/chatbot.module';


@NgModule({
    declarations: [
        LayoutComponent,
    ],
    imports     : [
        EmptyLayoutModule,
        ClassicLayoutModule,
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        FuseFullscreenModule,
        FuseLoadingBarModule,
        FuseNavigationModule,
        UserModule,
        SharedModule,
        MatSelectModule,
        ChatbotModule,
        TranslateModule.forRoot()
    ],
    exports     : [
        LayoutComponent,
        EmptyLayoutModule,
        ClassicLayoutModule
    ]
})
export class LayoutModule
{
}
