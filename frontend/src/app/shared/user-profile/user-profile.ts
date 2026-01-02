import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  user: any = null;
  changePasswordMode: boolean = false;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

}
