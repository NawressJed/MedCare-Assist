import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private baseUrl = 'http://localhost:8080/user-management';

  constructor(private http: HttpClient) { }

  getPatient(patient: Patient): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-patient/${patient.id}`);
  }

  getPatientsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-patients`);
  }

  createPatient(patient: Patient): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add-patient`, patient);
  }

  updatePatient(id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update-patient/${id}`, value);
  }

  deletePatient(patient: Patient): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-patient/${patient.id}`, { responseType: 'text' });
  }
  
}