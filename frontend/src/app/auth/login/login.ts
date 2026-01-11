import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    if(this.authService.isLoggedIn()){
      const user = this.authService.getUser();
      if(user?.role==='admin'){
        this.router.navigate(['/admin']);
      }else if(user?.role==='teacher'){
        this.router.navigate(['/teacher']);
      }
    }
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
