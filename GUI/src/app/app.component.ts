import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(public translate: TranslateService)
    {
        translate.addLangs(['en', 'fr']);
    }
}
