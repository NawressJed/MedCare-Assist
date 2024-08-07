import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationItem, FuseNavigationService } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Subject, takeUntil } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'landing-home',
    templateUrl: './home-v2.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LandingHomeComponent implements OnInit, OnDestroy {
    public state: boolean = true;
    isScreenSmall: boolean;
    navigation: FuseNavigationItem[];
    carouselOptions: OwlOptions = {
        loop: true,
        margin: 5,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['', ''],
        autoplay: true, // Enable autoplay
        autoplayTimeout: 5000, // Autoplay interval in milliseconds
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 5
            }
        },
        nav: false
    }

    itemsArray: any = [
        {
            imageName: "assets/images/specialties/dentist.png",
            specialtyName: "Dentist" 
        },
        {
            imageName: "assets/images/specialties/urology.png",
            specialtyName: "Urologist" 
        },
        {
            imageName: "assets/images/specialties/orthopedic_surgeon.png",
            specialtyName: "Orthopedic Surgeon" 
        },
        {
            imageName: "assets/images/specialties/radiologist.png",
            specialtyName: "Radiologist" 
        },
        {
            imageName: "assets/images/specialties/dermatology.png",
            specialtyName: "dermatologist" 
        },
        {
            imageName: "assets/images/specialties/pediatrician.png",
            specialtyName: "Pediatrician" 
        },
        {
            imageName: "assets/images/specialties/cardiologist.png",
            specialtyName: "Cardiologist" 
        },
        {
            imageName: "assets/images/specialties/family_physician.png",
            specialtyName: "Family Physician" 
        },
        {
            imageName: "assets/images/specialties/gastroenterologist.png",
            specialtyName: "Gastroenterologist" 
        },
        {
            imageName: "assets/images/specialties/gynecologist.png",
            specialtyName: "Gynecologist" 
        },
        {
            imageName: "assets/images/specialties/neurologist.png",
            specialtyName: "Neurologist" 
        },
        {
            imageName: "assets/images/specialties/ophthalmologist.png",
            specialtyName: "Ophthalmologist" 
        },
        {
            imageName: "assets/images/specialties/surgeon.png",
            specialtyName: "Surgeon" 
        },
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
    ) {
    }


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


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    scrollToSection(event: Event, sectionId: string): void {
        event.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
}

