import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  enterResult(resultData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/results`, resultData);
  }

  generateClassPositions(classLevel: string, term: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/results/positions`, { classLevel, term });
  }

  getResultsByClass(classLevel: string, term: string, studentName: string): Observable<any> {
    const params = { studentName, term };
    return this.http.get<any>(`${this.apiUrl}/results/class/${classLevel}`, { params: params });
  }

  deleteResult(resultId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/results/${resultId}`);
  }

  updateResult(resultId: string, resultData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/results/${resultId}`, resultData);
  }

  searchResults(name: string, term: string, classLevel: string): Observable<any> {
    const params= { term, classLevel };
    return this.http.get<any>(`${this.apiUrl}/results/search/${name}`, { params: params });
  }
}
