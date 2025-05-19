import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
export interface Program {
  code: string;
  name: string;
  quota: number;
}
@Component({
  selector: 'app-sort-applicants',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatBadgeModule],
  templateUrl: './sort-applicants.component.html',
  styleUrls: ['./sort-applicants.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SortApplicantsComponent {
  displayedColumns: string[] = ['id', 'name', 'general', 'special', 'status'];
  faculties: any[] = [];
  selectedEmail: string = '';
  emailMessage: string = 'test123';
  filteredApplicants: any[] = [];
  searchTerm: string = '';
  applicants: any[] = [];
  selectedProgramCode: string = '';
  programs: { [key: string]: Program[] } = {};
  entryRequirements: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.fetchCoursesGrouped();
    this.fetchCourses();
    this.fetchEntryRequirements();
  }


  ngOnChanges(): void {
    this.filterApplicants();
  }


  fetchCoursesGrouped() {
    this.http.get<any[]>('https://localhost:7108/api/Course/grouped')
      .subscribe(data => {
        this.faculties = data;
        this.cdr.detectChanges();
      });
  }
  getRequirementClass(met: number, total: number): string {
    return met === total ? 'requirement-met' : 'requirement-partial';
  }

  selectProgram(programCode: string) {
    this.selectedProgramCode = programCode;

    this.http.get<any[]>(`https://localhost:7108/api/Application/by-program/${programCode}`)
      .subscribe(data => {
        this.applicants = data.map(app => {
          const spm = JSON.parse(app.spmResult || '{}');
          const preu = JSON.parse(app.preUResult || '{}');
          const preUType = app.preUType;
          console.log(spm);
          console.log(preUType);
          console.log(preu);
          console.log(this.entryRequirements);

          let generalReqs: any[] = [];

          for (const req of this.entryRequirements) {
            if (req.requirement_type == 'general') {
              if (req.graduate_type == 'SPM') {
                generalReqs.push(req);
              }
              if (req.graduate_type == preUType) {
                generalReqs.push(req);
              }
            }
          }
          console.log(generalReqs);

          let specialReqs: any[] = [];

          for (const req of this.entryRequirements) {
            if (req.requirement_type == 'special') {

              if (req.graduate_type == preUType) {
                if (req.program_code === programCode) {
                  specialReqs.push(req);
                }
              }
            }
          }
          console.log(specialReqs);

          const generalMet = generalReqs.filter(r => this.meetsRequirement(r, spm, preu)).length;
          const specialMet = specialReqs.filter(r => this.meetsRequirement(r, spm, preu)).length;

          return {
            ...app,
            generalMet,
            generalTotal: generalReqs.length,
            specialMet,
            specialTotal: specialReqs.length
          };
        });

        this.filteredApplicants = [...this.applicants];
        this.cdr.detectChanges();
      });
  }

  meetsRequirement(req: any, spm: any, preu: any): boolean {
    const gradeRank: any = {
      'A+': 1, 'A': 2, 'A-': 3, 'B+': 4, 'B': 5, 'B-': 6,
      'C+': 7, 'C': 8, 'C-': 9, 'D': 10, 'E': 11, 'G': 12,
      '5.0': 1, '4.0': 2, '3.67': 3, '3.33': 4, '3.0': 5, '2.0': 6, '1.0': 7
    };

    const subject = req.subject;
    const requiredGrade = req.grade;
    const studentGrade = req.graduate_Type === 'SPM' ? spm[subject] : preu[subject];

    if (!studentGrade) return false;

    const studentRank = gradeRank[studentGrade] ?? 999;
    const requiredRank = gradeRank[requiredGrade] ?? 999;

    return studentRank <= requiredRank;
  }


  getQuota(programCode: string): number {
    for (const facultyPrograms of Object.values(this.programs)) {
      const program = facultyPrograms.find(p => p.code === programCode);
      if (program) {
        return program.quota;
      }
    }
    return 0;
  }


  fetchEntryRequirements() {
    this.http.get<any[]>('https://localhost:7108/api/EntryRequirement')
      .subscribe(data => {
        this.entryRequirements = data;
        this.cdr.detectChanges();
      });
  }


  fetchCourses(): void {
    this.http.get<{ [key: string]: Program[] }>('https://localhost:7108/api/Course/courses')
      .subscribe(response => {
        this.programs = response;
      }, error => {
        console.error('Error fetching courses:', error);
      });
  }

  getProgramName(code: string): string {
    for (const faculty in this.programs) {
      const found = this.programs[faculty].find(program => program.code === code);
      if (found) {
        return found.name;
      }
    }
    this.cdr.detectChanges();
    return code;
  }


  filterApplicants() {
    const term = this.searchTerm.toLowerCase();
    this.filteredApplicants = this.applicants.filter(app =>
      app.name.toLowerCase().includes(term) || app.ic.toLowerCase().includes(term)
    );
  }

  sendEmail() {
    if (!this.selectedEmail || !this.emailMessage) {
      alert('Please select an email and enter a message.');
      return;
    }

    const emailData = {
      to: this.selectedEmail,
      subject: 'Automated Email from AIROST',
      body: this.emailMessage
    };

    this.http.post('https://localhost:5001/api/email/send', emailData)
      .subscribe(response => {
        alert('Email sent successfully!');
      }, error => {
        alert('Error sending email:' + error);
      });
  }
}
