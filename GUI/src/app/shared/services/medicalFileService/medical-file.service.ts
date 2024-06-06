import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MedicalFile } from 'app/shared/models/medicalFile/medical-file';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalFileService {

  private baseUrl = 'http://localhost:8080/core-services';

  constructor(
    private http: HttpClient
  ) { }

  createPatientMedicalFile(doctorId: string, patientId: string, medicalFile: MedicalFile): Observable<MedicalFile> {
    return this.http.post<MedicalFile>(`${this.baseUrl}/medical-file/doctor/${doctorId}/patient/${patientId}`, medicalFile);
  }

  getPatientMedicalFiles(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-medical-file/patient/${id}`);
  }

  getMedicalFileById(id: string): Observable<MedicalFile> {
    return this.http.get<MedicalFile>(`${this.baseUrl}/get-medical-file/${id}`);
  }
}
