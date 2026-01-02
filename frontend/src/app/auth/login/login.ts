import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  loading: boolean = false;
  errorMessage: string| null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(){
    this.loading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next:(res)=>{
        this.loading = false;
      },
      error:(err)=>{
        this.loading = false;
        this.errorMessage = err.error.message || 'Login failed. Please try again.';

        setTimeout(() => {
          this.errorMessage = null;
        }, 4000);

        this.loginForm.reset();
      }
    })
  }
}
