import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector       : 'error-403',
    templateUrl    : './error-403.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error403Component
{
    /**
     * Constructor
     */
    constructor(private _location: Location)
    {
    }

    goBack(): void {
        this._location.historyGo(-2);
      }
}
