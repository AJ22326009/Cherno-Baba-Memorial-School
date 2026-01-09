import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.services/user';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: any[] = [];
  registerMode: boolean = false;
  updateMode: boolean = false;
  userForm: FormGroup;
  emailToUpdate: string | null = null;

  loadingUsers: boolean = false;
  loadingUpdateRegister: boolean = false;
  loadingDelete: boolean = false;
  errorLoadingUsers: string | null = null;
  error: string | null = null;

  deleteId: string | null = null;

  successMessage: string | null = null;

  constructor(private userService: UserService, private authService: AuthService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      imageUrl: ['']
    });

    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'teacher') {
        this.userForm.addControl('assignedClass', this.fb.control('', Validators.required));
        this.userForm.get('assignedClass')?.setValidators([Validators.required]);
        this.userForm.get('assignedClass')?.updateValueAndValidity();
      } else {
        this.userForm.removeControl('assignedClass');
      }
    });
  }

  ngOnInit() {
    this.fetchUsers();

    this.route.queryParams.subscribe(params => {
      if (params['registerMode'] === 'true') {
        this.toRegisterMode();
      }
    })
  }

  fetchUsers() {
    this.loadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
      this.users = data;
      this.loadingUsers = false
      this.errorLoadingUsers = null;
      },
      error: (err) => {
        this.loadingUsers = false;
        this.errorLoadingUsers = 'Error loading users';
      }
    });
  }

  registerUser() {
    this.loadingUpdateRegister = true;
    this.userService.createUser(this.userForm.value).subscribe({
      next:()=>{
            this.fetchUsers();
            this.registerMode = false;
            this.userForm.reset();
            this.loadingUpdateRegister = false;

            this.successMessage = 'User registered successfully';
            setTimeout(() => {
              this.successMessage = null;
            },3000);
          },
      error:()=>{
            this.loadingUpdateRegister = false;
            this.error = 'Error registering user';

            setTimeout(() => {
              this.error = null;
            }, 3000);
      }
    });
  }

  toUpdateMode(user: any){
    this.updateMode=true;
    this.scrollToRegisterEdit();
    this.userForm.removeControl('password');
    this.emailToUpdate=user.email;
    
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
      assignedClass: user.assignedClass
  })
  }

  toRegisterMode(){
    this.registerMode=true;
    this.userForm.addControl('password', this.fb.control('', Validators.required));
    this.userForm.reset();
  }

  updateUser() {
    this.loadingUpdateRegister = true;
    const userId = this.users.find(user => user.email === this.emailToUpdate)?._id;
    if (!userId) {
      console.error('User ID not found for the given email.');
      this.loadingUpdateRegister = false;
      return;
    }
    this.userService.updateUser(userId, this.userForm.value).subscribe({
      next:() => {
        this.loadingUpdateRegister = false;
      this.users = this.users.map(user => user._id === userId ? {...user, ...this.userForm.value} : user);
      this.updateMode = false;
      this.userForm.reset();
      
      this.successMessage = 'User updated successfully';
      setTimeout(() => {
        this.successMessage = null;
      },3000);
    },
      error:() => {
        this.loadingUpdateRegister = false;
        this.error = 'Error updating user';

        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
  });
  }

  deleteUser(userId: string) {
    this.loadingDelete = true;
    this.deleteId=userId;
    if(!confirm('Are you sure you want to delete this user?')) {
      this.loadingDelete = false;
      return;
    }
    this.userService.deleteUser(userId).subscribe(
      {next: ()=>{
      this.users = this.users.filter(user => user._id !== userId);
      this.loadingDelete = false;

      this.successMessage = 'User deleted successfully';
      setTimeout(() => {
        this.successMessage = null;
      },3000);
    }, error: ()=>{
      this.loadingDelete = false;
      this.error = 'Error deleting user';

      setTimeout(() => {
        this.error = null;
      }, 3000);
    }
    });
  }

  scrollToRegisterEdit() {
    setTimeout(() => {
    document.getElementById('registerEdit')?.scrollIntoView({ behavior: 'smooth' });
  }, 10);
  }

  cancel(){
    this.registerMode=false;
    this.updateMode=false;
    this.userForm.reset();
  }
}
