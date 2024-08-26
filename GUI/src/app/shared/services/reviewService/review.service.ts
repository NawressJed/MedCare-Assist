import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from 'app/shared/models/review/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:8080/core-services';

  constructor(private http: HttpClient) { }

  createReview(patientId: string, doctorId: string, appointmentId: string, review: { rating: number, reviewText: string }): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/add-review/patient/${patientId}/doctor/${doctorId}/appointment/${appointmentId}`, review);
  }

  getReviewsByDoctor(doctorId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/get-reviews/${doctorId}`);
  }

  getReviewById(reviewId: string): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/get-review/${reviewId}`);
  }

  getAverageRating(doctorId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/average-rating/${doctorId}`);
  }

  getReviewCount(doctorId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-reviews/count/${doctorId}`);
  }

  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete-review/${reviewId}`);
  }
}
