declare var require: any;

/* eslint-disable */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'classic-layout',
    templateUrl: './classic.component.html',
    styleUrls    : ['./classic.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    
    version = require('../../../../../../package.json').version;
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedCountryCode = 'fr';
    countryCodes = ['fr', 'gb'];
    customLabels = {
        'fr': 'Français',
        'gb': 'English',
    };

    changeSelectedCountryCode(value: string): void {
        this.selectedCountryCode = value;
        if (value === 'gb') {
            value = 'en'
        }
        this.translate.use(value);
    }

    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        public translate: TranslateService
    ) {
        translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('en');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: FuseNavigationItem[]) => {
                this.navigation = navigation;
            });
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

    }

    public selectLanguage(event: any) {
        this.translate.use(event.target.value);
    };

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
