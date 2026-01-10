import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/services/user.services/user';
import { StudentService } from '../../shared/services/student.services/student';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ResultService } from '../../shared/services/result.services/result';
import { Validators, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, ReactiveFormsModule, NgxPrintModule],
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
  teachers: any[] = [];
  latestStudents: any[] = [];

  error: string = '';
  success: string = '';
  loadingSearch: boolean = false;
  loadingDelete: boolean = false;
  deleteResultId: string = '';

  results: any[] = [];
  noResults: boolean = false;

  searchForm: FormGroup;

  
  constructor(private authService: AuthService, private userService: UserService, private studentService: StudentService, private router: Router, private resultService: ResultService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      name: ['', Validators.required],
      term: ['', Validators.required],
      classLevel: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.countTeachers()
    this.fetchStudents()
  }

  countTeachers(){
    this.userService.getAllUsers().subscribe(users => {
      this.teachers = users.filter((user: any) => user.role === 'teacher');
      this.teacherCount = this.teachers.length;
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

  searchResults(){
    this.loadingSearch = true;
    const { name, term, classLevel } = this.searchForm.value;
    this.resultService.searchResults(name, term, classLevel).subscribe({
      next: (results) => {
        this.loadingSearch = false;
        this.results = results;
        this.noResults = this.results.length === 0;
        
      },
      error: (error) => {
        this.loadingSearch = false;
        this.error = 'error searching results. Please try again later.';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  deleteResult(resultId: string){
    this.loadingDelete=true;
    this.deleteResultId=resultId;
    if(confirm('Are you sure you want to delete this result?')) {
    this.resultService.deleteResult(resultId).subscribe({
      next: () => {
        this.loadingDelete=false;
        console.log('Result deleted successfully');
        this.results = this.results.filter(result => result._id !== resultId);
      },
      error: (err) => {
        this.loadingDelete=false;
        console.log('Error deleting result:', err);
      }
    });
  }
  }

  clearSearch(){
    this.results = [];
    this.searchForm.get('name')?.setValue('');
    this.searchForm.get('term')?.setValue('');
    this.searchForm.get('classLevel')?.setValue('');
    this.noResults = false;
  }

  findClassTeacher(classLevel: string): string {
    const classTeacher = this.teachers.find(teacher => teacher.assignedClass === classLevel);
    return classTeacher ? classTeacher.name : 'not assigned';
  }

  calStudentsInClass(classLevel: string): number {
    return this.students.filter(student => student.classLevel === classLevel).length;
  }

  navigateToRegisterStudent(){
    this.router.navigate(['/admin/students'], { queryParams: { registerMode: 'true' } });
  }

  navigateToRegisterUser(){
    this.router.navigate(['/admin/users'], { queryParams: { registerMode: 'true' } });
  }
}
