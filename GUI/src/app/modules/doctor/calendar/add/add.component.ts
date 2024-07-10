import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { Schedule } from 'app/shared/models/schedule/schedule';
import { ScheduleService } from 'app/shared/services/scheduleService/schedule.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
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
export class AddComponent implements OnInit {

  formFieldHelpers: string[] = [''];
  submitted = false;

  schedule: Schedule;
  scheduleForm: FormGroup;
  doctorId: string;

  @Output() scheduleCreated = new EventEmitter<Schedule>();

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  constructor(
    private _matDialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private _scheduleService: ScheduleService
  ) { 
    this.doctorId = data.doctorId;
  }

  ngOnInit(): void {
    // Create the form
    this.scheduleForm = this._formBuilder.group({
      date: [''],
      startTime: [''],
      endTime: [''],
      available: [true],
    });

    if (this.data.date) {
      this.scheduleForm.patchValue({
        date: this.data.date
      });
    }
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const schedule: Schedule = this.scheduleForm.value;
      this._scheduleService.createSchedule(this.doctorId, schedule).subscribe((createdSchedule: Schedule) => {
        this.scheduleCreated.emit(createdSchedule);
        this._matDialogRef.close(createdSchedule);
      });
    }
  }

  close(): void {
    // Close the dialog
    this._matDialogRef.close();
  }

}
