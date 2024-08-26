import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { Patient } from 'app/shared/models/users/patient/patient';
import { User } from 'app/shared/models/users/user';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private baseUrl = 'http://localhost:8080/user-management';

    constructor(private http: HttpClient) {}

    getUserByEmail(email: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-user-by-email/${email}`);
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/get-user/${id}`);
    }

    getPatient(id: string): any {
        return this.http.get(`${this.baseUrl}/get-patient/${id}`);
    }

    getPatientByEmail(email: string): Observable<Patient[]> {
        return this.http.get<Patient[]>(
            `${this.baseUrl}/get-patient-by-email`,
            { params: { email } }
        );
    }

    searchPatientsByEmail(email: string): Observable<Patient[]> {
        return this.http.get<Patient[]>(
            `${this.baseUrl}/search-patients-by-email`,
            { params: { email } }
        );
    }

    getPatientsList(): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-all-patients`);
    }

    getDoctorPatientsList(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-doctor-patients/${id}`);
    }

    addPatientToDoctor(doctorId: string, patientId: string): Observable<any> {
        return this.http.put(
            `${this.baseUrl}/patient-to-doctor/${doctorId}/${patientId}`,
            {}
        );
    }

    createPatientToDoctor(id: string, patient: Patient): Observable<Object> {
        return this.http.put(
            `${this.baseUrl}/add-patient-to-doctor/${id}`,
            patient
        );
    }

    createPatient(patient: Patient): Observable<Object> {
        return this.http.post(`${this.baseUrl}/add-patient`, patient);
    }

    updatePatient(id: string, value: any): Observable<Object> {
        return this.http.put(`${this.baseUrl}/update-patient/${id}`, value);
    }

    getDoctor(doctorId: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-doctor/${doctorId}`);
    }

    getDoctorsList(): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-all-doctors`);
    }

    createDoctor(doctor: Doctor): Observable<Object> {
        return this.http.post(`${this.baseUrl}/add-doctor`, doctor);
    }

    updateDoctor(id: string, doctor: Doctor): Observable<Object> {
        
        return this.http.put(`${this.baseUrl}/update-doctor/${id}`, doctor);
    }
    
    getTotalPatients(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-patient/total/${id}`);
    }

    getMalePatientsCount(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-male/total/${id}`);
    }

    getFemalePatientsCount(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/get-female/total/${id}`);
    }

    deleteUser(user: User): Observable<any> {
        return this.http.delete(`${this.baseUrl}/delete-user/${user.id}`, {
            responseType: 'text',
        });
    }

    getDoctorBySpecialty(specialty: string): Observable<any> {
        const params = new HttpParams().set('specialty', specialty);
        return this.http.get<any>(`${this.baseUrl}/doctors`, { params: params });
    }
    
}
