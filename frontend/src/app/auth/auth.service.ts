import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { User } from '../shared/models/user.model';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  user: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  restoreUserFromToken() {
    const accessToken = localStorage.getItem('accessToken');
    if(!accessToken){
      return;
    }
  
    try {
      const decoded = jwtDecode<any>(accessToken);
      this.user = decoded;
    } catch (error) {
      this.logout();
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res=>{
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);

        const decoded: any = jwtDecode(res.accessToken);
        this.user=decoded;

        if(this.user?.role==='admin'){
          this.router.navigate(['/admin']);
        }else if(this.user?.role==='teacher'){
          this.router.navigate(['/teacher']);
        }
      })
    )
  }

  getUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if(refreshToken){
      this.http.post<any>(`${this.apiUrl}/logout`, {refreshToken}).subscribe();
    }

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    this.user = null;
    this.router.navigate(['/login']);
  }

  refresh(): Observable<any>{
    const refreshToken = localStorage.getItem('refreshToken');
    if(!refreshToken){
      this.logout();
      return throwError(() => new Error('No refresh token found'));
    }

    return this.http.post<any>(`${this.apiUrl}/refresh`, {refreshToken}).pipe(
      tap({
        next: (res)=>{
          localStorage.setItem('accessToken', res.accessToken);
          const decoded: any = jwtDecode(res.accessToken);
          this.user=decoded;
          console.log('Token refreshed successfully');
        },
        error: ()=>{
          this.logout()
        }
      })
    );
  }
}
