import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class Unauthorized {
  constructor(private authService: AuthService, private router: Router) {}

  goToDashboard() {
    const user = this.authService.getUser();
    if (user?.role === 'admin') {
      this.router.navigate(['/admin']);
      console.log('Navigating to admin dashboard');
    } else if (user?.role === 'teacher') {
      this.router.navigate(['/teacher']);
      console.log('Navigating to teacher dashboard');
    } else {
      this.router.navigate(['/login']);
    }
  }
}
