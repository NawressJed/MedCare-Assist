import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

declare var particlesJS: any;

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    styleUrls: ['./confirmation-required.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent implements AfterViewInit
{

    @ViewChild('particlesJs', { static: true }) particlesJs: ElementRef;

    /**
     * Constructor
     */
    constructor()
    {
    }

    ngAfterViewInit(): void {
        particlesJS.load(this.particlesJs.nativeElement.id, 'assets/particlesjs-config.json');

    }
}
