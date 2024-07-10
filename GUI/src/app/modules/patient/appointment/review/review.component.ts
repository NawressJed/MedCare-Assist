import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ReviewService } from 'app/shared/services/reviewService/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styles: [
    `
       cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class ReviewComponent implements OnInit {
  reviewForm: FormGroup;
  stars: boolean[] = Array(5).fill(false);

  constructor(
    private _matDialogRef: MatDialogRef<ReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [0, Validators.required],
      reviewText: ['', Validators.required],
    });
    this.updateStars();
  }

  updateStars(): void {
    const rating = this.reviewForm.get('rating').value;
    this.stars = this.stars.map((_, i) => i < rating);
  }

  rate(rating: number): void {
    this.reviewForm.patchValue({ rating });
    this.updateStars();
  }

  close(): void {
    this._matDialogRef.close();
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
        const reviewData = {
            rating: this.reviewForm.value.rating,
            reviewText: this.reviewForm.value.reviewText
        };

        this.reviewService.createReview(
            this.data.patientId,
            this.data.doctorId,
            this.data.appointmentId,
            reviewData
        ).subscribe(
            (response) => {
                this.openConfirmationDialog();
                this._matDialogRef.close({ submitted: true });
            },
            (error) => {
                console.error('Error submitting review:', error);
            }
        );
    }
}

  openConfirmationDialog(): void {
    this._fuseConfirmationService.open({
      title: 'Review Submitted!',
      message: '<span class="font-medium">Thank you for your feedback.</span> Your review has been sent to your doctor.',
      icon: {
        show: true,
        name: 'heroicons_outline:check',
        color: 'success'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ok',
          color: 'primary'
        },
        cancel: {
          show: false,
          label: 'Cancel'
        }
      },
      dismissible: true
    });
  }
}
