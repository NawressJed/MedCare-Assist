import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Schedule } from 'app/shared/models/schedule/schedule';
import { ScheduleService } from 'app/shared/services/scheduleService/schedule.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styles: [
    `
        input[type="time"]::-webkit-calendar-picker-indicator {
            display: none;
        }

        cards fuse-card {
            margin: 16px;
        }
        `
  ]
})
export class UpdateComponent implements OnInit {

  formFieldHelpers: string[] = [''];
  submitted = false;

  schedule: Schedule;
  scheduleForm: FormGroup;
  doctorId: string;

  @Output() scheduleUpdated = new EventEmitter<boolean>();

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private _matDialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _scheduleService: ScheduleService
  ) {
    this.doctorId = data.doctorId;
  }

  ngOnInit(): void {
    this.scheduleForm = this._formBuilder.group({
      date: [''],
      startTime: [''],
      endTime: [''],
      available: [true],
    });

    if (this.data.scheduleId) {
      this.loadSchedule(this.data.scheduleId);
    } else {
      this.scheduleForm.patchValue({
        date: this.data.date,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        available: this.data.available
      });
    }
  }

  loadSchedule(scheduleId: string): void {
    this._scheduleService.getScheduleById(scheduleId).subscribe((schedule: Schedule) => {
      this.scheduleForm.patchValue({
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        available: schedule.available
      });
    });
  }

  submit(): void {
    if (this.scheduleForm.valid) {
      const schedule: Schedule = this.scheduleForm.value;
      this._scheduleService.updateSchedule(this.data.scheduleId, schedule).subscribe(() => {
        this._matDialogRef.close(true);
      });
    }
  }

  close(): void {
    this._matDialogRef.close();
  }

  delete(): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Schedule',
      message: 'Are you sure you want to remove this schedule? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._scheduleService.deleteSchedule(this.data.scheduleId).subscribe(
          () => {
            console.log('Schedule deleted successfully.');
            this._matDialogRef.close(true);
          },
          (error) => {
            console.error('Error deleting schedule:', error);
          }
        );
      }
    });
  }
}
