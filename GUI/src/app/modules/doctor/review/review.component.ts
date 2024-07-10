import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseCardComponent } from '@fuse/components/card';
import { Review } from 'app/shared/models/review/review';
import { ReviewService } from 'app/shared/services/reviewService/review.service';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styles: [
    `
      cards fuse-card {
        margin: 16px;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewComponent implements OnInit {
  reviews$: Observable<Review[]>;
  overallRating: number;
  reviewCount: number;

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  drawerMode: 'side' | 'over';

  constructor(
    private reviewService: ReviewService,
    private _cookie: CookieService
  ) { }

  ngOnInit(): void {
    const doctorId = this._cookie.get('id'); 
    this.reviews$ = this.reviewService.getReviewsByDoctor(doctorId).pipe(
      map(reviews => {
        this.reviewCount = reviews.length;
        return reviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      })
    );

    this.reviewService.getAverageRating(doctorId).subscribe(
      rating => this.overallRating = rating,
      error => console.error('Error fetching average rating:', error)
    );
  }

  isShortContent(content: string): boolean {
    return content && content.length < 50;
  }
}
