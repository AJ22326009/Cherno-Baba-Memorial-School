import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.services/user';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  user: any = null;
  changePasswordMode: boolean = false;
  passwordForm: FormGroup;
  error: string='';
  success: string='';
  loading: boolean=false;

  constructor(private authService: AuthService, private fb: FormBuilder, private userService: UserService) {
    this.user = this.authService.getUser();
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

  updatePassword() {
    this.loading = true;
    const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;
    
    if (newPassword !== confirmNewPassword) {
      this.error = "Confirm password does not match.";

      setTimeout(() => {
        this.error = '';
      }, 3000);

      this.loading = false;
      return;
    }

    this.userService.updatePassword(this.user.userId, currentPassword, newPassword).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = "Password updated successfully.";
        setTimeout(() => {
          this.success = '';
          this.changePasswordMode = false;
        }, 3000);
        
        this.passwordForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message;

        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    })
  };
}
