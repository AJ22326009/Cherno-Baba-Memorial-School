import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../shared/services/student.services/student';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/services/user.services/user';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-students',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class StudentsForAdmin implements OnInit{
  studentsInClass: any[] = [];
  searchedStudents: any[] = [];

  classForm: FormGroup;
  registerUpdateForm: FormGroup;
  searchForm: FormGroup;

  classTeacher: string='';
  teachers: any[] = [];

  registerMode: boolean = false;
  updateMode: boolean = false;

  idToUpdate: string = '';

  loadingClass: boolean = false;
  loadingSearch: boolean = false;
  loadingRegisterUpdate: boolean = false;
  loadingDelete: boolean = false;

  deleteId: string ='';

  error: string | null = null;
  success: string | null = null;

  constructor(private studentService: StudentService, private authService: AuthService, private userService: UserService, private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.classForm = this.fb.group({
      classLevel: ['', Validators.required]
    });

    this.registerUpdateForm = this.fb.group({
      fullName: ['', Validators.required],
      classLevel: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.searchForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchTeachers();

    this.route.queryParams.subscribe(params => {
      if (params['registerMode'] === 'true') {
        this.toRegisterMode();
      }
    })
  }

  fetchStudentsByClassLevel(classLevel: string) {
    this.loadingClass = true;
    this.studentService.getStudentsByClassLevel(classLevel).subscribe({
      next: (data) => {
        this.studentsInClass = data;
        this.loadingClass = false;
        this.classTeacher = this.teachers.find((teacher) => teacher.assignedClass === classLevel)?.name || 'Not Assigned';
      },
      error: (err) => {
        this.loadingClass = false;
        this.error = `Error fetching students for ${classLevel}`;
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    });
  }

  fetchTeachers(){
    this.userService.getAllUsers().subscribe((users) => {
      this.teachers = users.filter((user: any) => user.role === 'teacher').map((teacher: any) => ({
        assignedClass: teacher.assignedClass,
        name: teacher.name
      }))
    })
  }

  cancel(){
    this.registerMode=false;
    this.updateMode=false;
  }

  toRegisterMode(){
    this.registerMode=true;
    this.scrollToRegisterEdit()
  }

  toUpdateMode(student: any){
    this.updateMode=true;
    this.scrollToRegisterEdit();

    this.idToUpdate=student._id;

    this.registerUpdateForm.patchValue({
      fullName: student.fullName,
      classLevel: student.classLevel,
      gender: student.gender
    })
  }

  registerStudent(){
    this.loadingRegisterUpdate = true;
    this.studentService.createStudent(this.registerUpdateForm.value).subscribe({
      next:()=>{
        this.loadingRegisterUpdate = false;
        if(this.registerUpdateForm.value.classLevel === this.classForm.value.classLevel) {
          this.fetchStudentsByClassLevel(this.classForm.value.classLevel);
        }
        if(this.registerUpdateForm.value.fullName.toLowerCase().includes(this.searchForm.value.name.toLowerCase())
          && this.searchForm.value.name !== ''
        ) {
          this.searchStudentsByName();
        }
        this.registerMode=false;
        this.registerUpdateForm.reset();

        this.success = 'Student registered successfully';
        setTimeout(() => {
          this.success = null;
        }, 3000);
      },
      error:(err)=>{
        this.loadingRegisterUpdate = false;

      this.error = 'Error registering student';
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    })
  }

  updateStudent(){
    this.loadingRegisterUpdate = true;
    this.studentService.updateStudent(this.idToUpdate, this.registerUpdateForm.value).subscribe({
      next:()=>{
        this.loadingRegisterUpdate = false;
        if(this.studentsInClass.find(student => student._id === this.idToUpdate)) {
          this.fetchStudentsByClassLevel(this.classForm.value.classLevel);
        }

        if(this.searchedStudents.find(student => student._id === this.idToUpdate)) {
          this.searchStudentsByName();
        }
        
        
        this.updateMode=false;
        this.registerUpdateForm.reset();

        this.success = 'Student updated successfully';
        setTimeout(() => {
          this.success = null;
        }, 3000);
      },
      error:(err)=>{
        this.loadingRegisterUpdate = false;

        this.error = 'Error updating student';
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    });
  }

  deleteStudent(studentId: string) {
    if(!confirm('Are you sure you want to delete this student?')) {
      return;
    }
    this.deleteId = studentId;
    this.loadingDelete=true;
    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        this.loadingDelete=false;
        if(this.studentsInClass.find(student => student._id === studentId)) {
        this.studentsInClass = this.studentsInClass.filter(student => student._id !== studentId);
        }

        if(this.searchedStudents.find(student => student._id === studentId)) {
        this.searchedStudents = this.searchedStudents.filter(student => student._id !== studentId);
        }

        this.success = 'Student deleted successfully';
        setTimeout(() => {
          this.success = null;
        }, 3000);
      },
      error: (err) => {
        this.loadingDelete=false;

        this.error = 'Error deleting student';
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    })
  }

  searchStudentsByName() {
    this.loadingSearch = true;
    this.studentService.searchStudentsByName(this.searchForm.value.name).subscribe({
      next: (data) => {
        this.loadingSearch = false;
        this.searchedStudents = data;
      },
      error: (err) => {
        this.loadingSearch = false;

        this.error = 'Error searching students';
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    })
  }

  scrollToRegisterEdit() {
    setTimeout(() => {
    document.getElementById('registerEdit')?.scrollIntoView({ behavior: 'smooth' });
  }, 10);
  }
}
