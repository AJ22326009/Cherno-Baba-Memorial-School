import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../shared/services/student.services/student';
import { ResultService } from '../../shared/services/result.services/result';
import { AuthService } from '../../auth/auth.service';
import { NgxPrintModule } from 'ngx-print';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  imports: [ReactiveFormsModule, NgxPrintModule],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  resultEnterMode: boolean = false;
  resultUpdateMode: boolean = false;

  teacher: any ='';
  class: any ='';
  students: any[] = [];
  results: any[] = [];

  resultsForm: FormGroup;
  searchForm: FormGroup;
  positionGenerationForm: FormGroup;

  resultToUpdateId: string='';
  deleteResultId: string='';

  loadingResults: boolean = false;
  loadingDelete: boolean = false;
  loadingPositions: boolean = false;
  loadingEnterUpdate: boolean = false;

  success: string ='';
  error: string ='';

  shouldGeneratePosition: boolean = false;

  noResults: boolean = false;
  constructor(private studentService: StudentService, private resultService: ResultService, private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) {
    this.resultsForm = this.fb.group({
      studentName: ['', Validators.required],
      term: ['', Validators.required],
      English: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Maths: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Phonics: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Verbal: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });

    this.searchForm = this.fb.group({
      studentName: ['', Validators.required],
      term: ['', Validators.required],
    })

    this.positionGenerationForm = this.fb.group({
      term: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    const user = this.authService.getUser();
    this.teacher=user?.name;
    this.class=user?.assignedClass;
    this.fetchStudents();
    
    this.route.queryParams.subscribe(params => {
      if (params['resultEnterMode'] === 'true') {
        this.resultEnterMode=true;
        this.scrollToResultForm()
      }else if(params['resultSearch']=== 'true'){
        this.scrollToResults()
      }
    })
  }

  toEnterMode(){
    this.resultEnterMode=true;
    this.resultUpdateMode=false;
  }
  saveResults() {
    this.loadingEnterUpdate = true;
    const scores=[
      { subject: 'English', score: this.resultsForm.value.English },
      { subject: 'Maths', score: this.resultsForm.value.Maths },
      { subject: 'Phonics', score: this.resultsForm.value.Phonics },
      { subject: 'Verbal', score: this.resultsForm.value.Verbal },
    ];
    
    const resultData={
      studentName: this.resultsForm.value.studentName,
      term: this.resultsForm.value.term,
      scores: scores
    };
    this.resultService.enterResult(resultData).subscribe({
      next:() => {
        this.loadingEnterUpdate=false;
        this.shouldGeneratePosition=true;

        this.cancel();
        this.success='Result saved successfully.';
        setTimeout(() => {
          this.success='';
        }, 3000);
      },
      error:(err) => {
      this.loadingEnterUpdate=false;
        this.error='Error saving result.';
        setTimeout(() => {
          this.error='';
        }, 3000);
      }
    });
  }

  toUpdateMode(result:any) {
    this.resultUpdateMode=true;
    this.resultEnterMode=false;
    this.scrollToResultForm();
    this.resultToUpdateId=result._id;

    this.resultsForm.patchValue({
      studentName: result.student.fullName,
      term: result.term,
      English: result.scores.find((s: any) => s.subject === 'English')?.score || 0,
      Maths: result.scores.find((s: any) => s.subject === 'Maths')?.score || 0,
      Phonics: result.scores.find((s: any) => s.subject === 'Phonics')?.score || 0,
      Verbal: result.scores.find((s: any) => s.subject === 'Verbal')?.score || 0,
    })
  }

  updateResults() {
    this.loadingEnterUpdate = true;
    const scores=[
      { subject: 'English', score: this.resultsForm.value.English },
      { subject: 'Maths', score: this.resultsForm.value.Maths },
      { subject: 'Phonics', score: this.resultsForm.value.Phonics },
      { subject: 'Verbal', score: this.resultsForm.value.Verbal },
    ];
    const resultData={
      studentName: this.resultsForm.value.studentName,
      term: this.resultsForm.value.term,
      scores: scores
    };
    this.resultService.updateResult(this.resultToUpdateId, resultData).subscribe({
      next:() => {
        this.loadingEnterUpdate=false;
        this.shouldGeneratePosition=true;
      
        this.success='Result updated successfully.';
        setTimeout(() => {
          this.success='';
        }, 3000);
        this.cancel();
      },
      error:(err) => {
        this.loadingEnterUpdate=false;
        this.error='Error updating result.';
        setTimeout(() => {
          this.error='';
        }, 3000);
      }
    })
  }

  fetchStudents() {
    if (this.class) {
      this.studentService.getStudentsByClassLevel(this.class).subscribe((data) => {
        this.students = data;
      });
    }
  }

  onSearch() {
    this.loadingResults = true;
    this.resultService.getResultsByClass(this.class, this.searchForm.value.term, this.searchForm.value.studentName).subscribe({
      next: (data) => {
        this.loadingResults = false;
        this.results = data;

        if(this.results.length === 0){
          this.noResults = true;
        } else {
          this.noResults = false;
        }
      },
      error: (err) => {
        this.loadingResults = false;
        this.error = 'Error fetching results';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }

  generatePositions() {
    this.loadingPositions = true;
    this.resultService.generateClassPositions(this.class, this.positionGenerationForm.value.term).subscribe({
      next: () => {
        this.loadingPositions = false;
        this.success = 'Positions generated successfully.';
        this.shouldGeneratePosition = false;

        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        this.loadingPositions = false;
        this.error = 'Error generating positions';
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    })
  }

  deleteResult(resultId: string) {
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

  cancel() {
    this.resultEnterMode=false;
    this.resultUpdateMode=false;
    this.resultsForm.get('studentName')?.setValue('');
    this.resultsForm.get('term')?.setValue('');
    this.resultsForm.get('English')?.setValue('');
    this.resultsForm.get('Maths')?.setValue('');
    this.resultsForm.get('Phonics')?.setValue('');
    this.resultsForm.get('Verbal')?.setValue('');
  }

  clearSearch(){
    this.results=[];
    this.searchForm.get('studentName')?.setValue('');
    this.searchForm.get('term')?.setValue('');
  }

  scrollToResultForm(){
    setTimeout(() => {
    document.getElementById('enterUpdate')?.scrollIntoView({ behavior: 'smooth' });
  }, 10);
  }
  scrollToResults(){
    setTimeout(() => {
    document.getElementById('searchResults')?.scrollIntoView({ behavior: 'smooth' });
  }, 10);
  }
}
