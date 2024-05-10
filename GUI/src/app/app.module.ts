import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { NgxFlagPickerModule } from 'ngx-flag-picker';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { WebSocketService } from './shared/services/notificationService/web-socket.service';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    useHash: false
};

export function createTranslateLoader(http: HttpClient): any {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        NgxFlagPickerModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),

        TranslateModule.forRoot({
            defaultLanguage: 'fr',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
            isolate: false
        }),
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        CookieService,
        WebSocketService,
        {
          provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
        }
      ]
})
export class AppModule
{
}
