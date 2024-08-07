import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { SpecialtyEnum } from 'app/shared/models/users/specialtyEnum';
import { ReviewService } from 'app/shared/services/reviewService/review.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorsComponent implements OnInit, OnDestroy {

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  selectedGenders: Set<string> = new Set();
  selectedSpecialties: Set<string> = new Set();

  doctors$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredDoctors$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  specialties: string[] = Object.values(SpecialtyEnum);
  genders: string[] = ['MALE', 'FEMALE'];

  filters: {
    categorySlug$: BehaviorSubject<string>;
    query$: BehaviorSubject<string>;
    hideCompleted$: BehaviorSubject<boolean>;
  } = {
      categorySlug$: new BehaviorSubject('all'),
      query$: new BehaviorSubject(''),
      hideCompleted$: new BehaviorSubject(false)
    };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private userService: UserService, private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors(): void {
    this.userService.getDoctorsList()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((doctors: any[]) => {
        const doctorObservables = doctors.map(doctor =>
          forkJoin({
            rating: this.reviewService.getAverageRating(doctor.id).pipe(takeUntil(this._unsubscribeAll)),
            reviewCount: this.reviewService.getReviewsByDoctor(doctor.id).pipe(
              takeUntil(this._unsubscribeAll),
              map(reviews => reviews.length)
            )
          }).pipe(
            map(({ rating, reviewCount }) => ({ ...doctor, rating, reviewCount }))
          )
        );

        forkJoin(doctorObservables).subscribe((doctorList: any[]) => {
          this.doctors$.next(doctorList);
          this.filteredDoctors$.next(doctorList);
        });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  applyFilters(): void {
    let filteredDoctors = this.doctors$.value;

    // Filter by gender
    if (this.selectedGenders.size > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => this.selectedGenders.has(doctor.gender));
    }

    // Filter by specialty
    if (this.selectedSpecialties.size > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => this.selectedSpecialties.has(doctor.specialty));
    }

    // Filter by query
    const query = this.filters.query$.value.toLowerCase();
    if (query) {
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.firstname.toLowerCase().includes(query) ||
        doctor.lastname.toLowerCase().includes(query)
      );
    }

    this.filteredDoctors$.next(filteredDoctors);
  }

  resetFilters(): void {
    this.selectedGenders.clear();
    this.selectedSpecialties.clear();
    this.filters.query$.next('');
    this.filteredDoctors$.next(this.doctors$.value);
  }

  filterByQuery(query: string): void {
    this.filters.query$.next(query);
  }

  toggleGender(gender: string): void {
    if (this.selectedGenders.has(gender)) {
      this.selectedGenders.delete(gender);
    } else {
      this.selectedGenders.add(gender);
    }
  }

  toggleSpecialty(specialty: string): void {
    if (this.selectedSpecialties.has(specialty)) {
      this.selectedSpecialties.delete(specialty);
    } else {
      this.selectedSpecialties.add(specialty);
    }
    console.log('Selected Specialties:', Array.from(this.selectedSpecialties));
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
