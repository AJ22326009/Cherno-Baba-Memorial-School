import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.html',
  styleUrl: './error.css',
})
export class Error implements OnInit {
  errorMessage: string | null = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.errorMessage = params['reason'];
    });

    if (!this.errorMessage) {
      this.route.data.subscribe(data => {
        this.errorMessage = data['reason'] || 'An unknown error occurred';
      });
    }
  }

  goToDashboard() {
    const user = this.authService.getUser();
    if (user?.role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (user?.role === 'teacher') {
      this.router.navigate(['/teacher']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
