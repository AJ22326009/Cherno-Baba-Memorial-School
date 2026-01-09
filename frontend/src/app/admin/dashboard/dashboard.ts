import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/services/user.services/user';
import { StudentService } from '../../shared/services/student.services/student';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class AdminDashboard implements OnInit {
  user: any;
  teacherCount: number = 0;
  studentCount: number = 0;
  maleStudents: number = 0;
  femaleStudents: number = 0;
  students: any[] = [];
  latestStudents: any[] = [];
  constructor(private authService: AuthService, private userService: UserService, private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.countTeachers()
    this.fetchStudents()
  }

  countTeachers(){
    this.userService.getAllUsers().subscribe(users => {
      this.teacherCount = users.filter((user: any) => user.role === 'teacher').length;
    });
  }

  countStudents(){
    this.studentCount = this.students.length;
    this.maleStudents = this.students.filter(student => student.gender === 'male').length;
    this.femaleStudents = this.students.filter(student => student.gender === 'female').length;

    this.latestStudents = this.students.slice(-4).reverse();
  }

  fetchStudents(){
    this.studentService.getAllStudents().subscribe(students => {
      this.students = students;
      this.countStudents();
    });
  }

  navigateToRegisterStudent(){
    this.router.navigate(['/admin/students'], { queryParams: { registerMode: 'true' } });
  }

  navigateToRegisterUser(){
    this.router.navigate(['/admin/users'], { queryParams: { registerMode: 'true' } });
  }
}
