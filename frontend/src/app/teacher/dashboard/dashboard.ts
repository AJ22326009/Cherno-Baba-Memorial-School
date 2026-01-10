import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { StudentService } from '../../shared/services/student.services/student';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class TeacherDashboard implements OnInit {
  user: any = null;
  students: any[] = [];
  studentCount: number = 0;
  maleCount: number=0;
  femaleCount: number=0;

  constructor(private authService: AuthService, private studentService: StudentService, private router: Router) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    this.studentService.getStudentsByClassLevel(this.user.assignedClass).subscribe({
      next: (data) => {
        this.students = data;
        this.countStudents();
      },
      error: (err) => {
        console.error('Error fetching students');
      }
    })
  }

  countStudents(){
    this.studentCount = this.students.length;
    this.maleCount = this.students.filter(student => student.gender === 'male').length;
    this.femaleCount = this.students.filter(student => student.gender ==='female').length;
  }

  navigateToResultsEnter(){
    this.router.navigate(['/teacher/results'], { queryParams: { resultEnterMode: 'true' } });
  }

  navigateToResultsSearch(){
    this.router.navigate(['/teacher/results'], {queryParams: {resultSearch: 'true'}})
  }
}
