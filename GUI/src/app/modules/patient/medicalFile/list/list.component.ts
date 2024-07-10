import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicalFile } from 'app/shared/models/medicalFile/medical-file';
import { MedicalFileService } from 'app/shared/services/medicalFileService/medical-file.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  medicalFiles: MedicalFile[] = [];

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

  constructor(
    private _medicalFileService: MedicalFileService,
    private _cookie: CookieService
  ) { }

  ngOnInit(): void {
    this.loadMedicalFiles();
  }

  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadMedicalFiles(): void {
    const patientId = this._cookie.get('id');
    this._medicalFileService.getPatientMedicalFiles(patientId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((files: MedicalFile[]) => {
        this.medicalFiles = files;
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Filter by search query
   *
   * @param query
   */
  filterByQuery(query: string): void {
    this.filters.query$.next(query);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

}
