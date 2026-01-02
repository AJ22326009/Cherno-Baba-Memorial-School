import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: any=null;
  homeLink: string = '';
  studentsLink: string = '/admin/students';
  resultsLink: string = '/teacher/results';
  usersLink: string = '/admin/users';
  role: string = '';

  constructor(private authService: AuthService) {
    this.user=this.authService.getUser();
    this.role=this.user?.role;
    if(this.role==='admin'){
      this.homeLink='/admin';
    }else{
      this.homeLink='/teacher';
    }
  }

  logout() {
    this.authService.logout();
  }

  
}
