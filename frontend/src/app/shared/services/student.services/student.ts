import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  apiUrl = environment.apiUrl;
  getAllStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/students`);
  }

  createStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/students`, studentData);
  }

  getStudentById(studentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/${studentId}`);
  }

  getStudentsByClassLevel(classLevel: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/class/${classLevel}`);
  }

  searchStudentsByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/name?name=${name}`);
  }

  updateStudent(studentId: string, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/students/${studentId}`, studentData);
  }

  deleteStudent(studentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/students/${studentId}`);
  }

}
