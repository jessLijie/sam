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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TemplateRef, ViewChild } from '@angular/core';
import { tap, catchError, of, forkJoin } from 'rxjs';

export interface Program {
  code: string;
  name: string;
  quota: number;
}
@Component({
  selector: 'app-sort-applicants',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
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
    MatBadgeModule,
    MatTooltipModule,

  ],
  templateUrl: './sort-applicants.component.html',
  styleUrls: ['./sort-applicants.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SortApplicantsComponent {
  displayedColumns: string[] = ['name', 'general', 'special', 'status'];
  faculties: any[] = [];
  selectedEmail: string = '';
  emailMessage: string = 'test123';
  filteredApplicants: any[] = [];
  searchTerm: string = '';
  applicants: any[] = [];
  selectedProgramCode: string = '';
  programs: { [key: string]: Program[] } = {};
  entryRequirements: any[] = [];
  dataSource = new MatTableDataSource<any>();
  @ViewChild('requirementDialog') requirementDialog!: TemplateRef<any>;
  @ViewChild('quotaReachedDialog') quotaReachedDialog!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private dialog: MatDialog,private snackBar: MatSnackBar,
) { }
  ngOnInit(): void {
    this.fetchCoursesGrouped();
    this.fetchCourses();
    this.fetchEntryRequirements();
  }

  ngOnChanges(): void {
    this.filterApplicants();
  }

  openRequirementDialog(requirements: any[]) {
    this.dialog.open(this.requirementDialog, {
      data: requirements
    });
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
          console.log("SPM Result: ", spm);
          console.log(preUType, " Result: ", preu);
          // console.log("Entry Requirement: ",this.entryRequirements);

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
          console.log("Matched general req", generalReqs);

          let specialReqs: any[] = [];

          for (const req of this.entryRequirements) {
            if (req.requirement_type == 'special') {

              if (req.graduate_type == preUType || req.graduate_type == 'SPM') {
                if (req.program_code === programCode) {
                  specialReqs.push(req);
                }
              }
            }
          }
          console.log("Matched special req", specialReqs);

          const generalMatch = generalReqs.filter(r => this.meetsRequirement(r, spm, preu))
          const generalMet = generalMatch.length;
          const specialMatch = specialReqs.filter(r => this.meetsRequirement(r, spm, preu))
          const specialMet = specialMatch.length;
          console.log("General Met: ", generalMatch);
          console.log("Special Met: ", specialMatch);

          const generalUnmet = generalReqs.filter(r => !generalMatch.includes(r));
          const specialUnmet = specialReqs.filter(r => !specialMatch.includes(r));


          return {

            ...app,
            generalMet,
            generalTotal: generalReqs.length,
            specialMet,
            specialTotal: specialReqs.length,
            generalMatch: generalMatch.map(r => ({
              ...r,
              actualGrade: (r.graduate_type === 'SPM' ? spm : preu)[r.subject]
            })),
            generalUnmet: generalUnmet.map(r => ({
              ...r,
              actualGrade: (r.graduate_type === 'SPM' ? spm : preu)[r.subject] ?? 'N/A'
            })),
            specialMatch: specialMatch.map(r => ({
              ...r,
              actualGrade: (r.graduate_type === 'SPM' ? spm : preu)[r.subject]
            })),
            specialUnmet: specialUnmet.map(r => ({
              ...r,
              actualGrade: (r.graduate_type === 'SPM' ? spm : preu)[r.subject] ?? 'N/A'
            })),
            generalDetails: generalReqs.map(r => {
              const subject = r.subject;
              const required = r.grade;
              const studentGrade = (r.graduate_type === 'SPM' ? spm : preu)[subject] || 'N/A';
              const met = this.meetsRequirement(r, spm, preu);
              return { subject, grade: required, studentGrade, met, graduate_type: r.graduate_type };
            }),
            specialDetails: specialReqs.map(r => {
              const subject = r.subject;
              const required = r.grade;
              const studentGrade = (r.graduate_type === 'SPM' ? spm : preu)[subject] || 'N/A';
              const met = this.meetsRequirement(r, spm, preu);
              return { subject, grade: required, studentGrade, met, graduate_type: r.graduate_type };
            }),
          };
        });

        this.filteredApplicants = [...this.applicants];
        this.cdr.detectChanges();
        this.dataSource.data = [...this.applicants];
        this.dataSource.sort = this.sort;
      });
  }

  groupByGraduateType(data: any[]) {
    const grouped: { [key: string]: any[] } = {};

    for (const item of data) {
      const type = item.graduate_type || 'Unknown';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(item);
    }

    return Object.keys(grouped).map(type => ({
      type,
      items: grouped[type]
    }));
  }

  // generateTooltip(met: any[], unmet: any[]): string {
  //   let tooltip = '';
  //   if (met.length > 0) {
  //     tooltip += '✅ Met:\n';
  //     for (const req of met) {
  //       tooltip += `• ${req.subject}: required ${req.grade}, got ${req.actualGrade}\n`;
  //     }
  //   }
  //   if (unmet.length > 0) {
  //     tooltip += '\n❌ Unmet:\n';
  //     for (const req of unmet) {
  //       tooltip += `• ${req.subject}: required ${req.grade}, got ${req.actualGrade}\n`;
  //     }
  //   }
  //   return tooltip.trim();
  // }

  // getRequirementTooltip(details: { subject: string; grade: string; met: boolean }[]): string {
  //   return details.map(d =>
  //     `${d.subject}: ${d.grade} <span style="color: ${d.met ? 'green' : 'red'}">${d.met ? '✓' : '✗'}</span>`
  //   ).join('<br/>');
  // }

  sortApplicantsAndApprove() {
    if (!this.selectedProgramCode) {
      alert("Please select a program first.");
      return;
    }

    const quota = this.getQuota(this.selectedProgramCode);
    let approvedCount = this.applicants.filter(a => a.status === 'approved').length;

    const eligibleApplicants = this.applicants.filter(app =>
      app.generalMet === app.generalTotal &&
      app.specialMet === app.specialTotal &&
      app.status !== 'approved'
    );

    const toApprove = [];

    for (const app of eligibleApplicants) {
      if (approvedCount < quota) {
        toApprove.push(app);
        approvedCount++;
      } else {
        break;
      }
    }

    if (toApprove.length === 0) {
      // alert("No applicants eligible or quota already filled.");
      this.dialog.open(this.quotaReachedDialog);
      return;
    }

    // Send approved status to backend for selected applications
    const updateRequests = toApprove.map(app => {
      return this.http.post(`https://localhost:7108/api/Application/updateStatusBulk/${app.id}`, {
        status: 'approved'
      }).pipe(
        tap(() => {
          app.status = 'approved'; // only update locally if backend confirms
          console.log("Approved: ", app.name);
          ; // update locally
          this.snackBar.open(`Approved: ${app.name}`, 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }),
        catchError(err => {
          console.error("Error approving applicant", app.name, err);
          return of(null);
        })
      );
    });

    // Wait for all HTTP requests to complete
    forkJoin(updateRequests).subscribe(() => {
      this.filteredApplicants = [...this.applicants];
      this.cdr.detectChanges();
    });
  }

  getApprovedCount(programCode: string): number {
    return this.applicants.filter(
      a => a.appliedProgram === programCode && a.applicationStatus === 'approved'
    ).length;
  }

  isQuotaFull(): boolean {
    if (!this.selectedProgramCode) return true;

    const approvedCount = this.getApprovedCount(this.selectedProgramCode);
    const quota = this.getQuota(this.selectedProgramCode);

    return approvedCount >= quota;
  }

  meetsRequirement(req: any, spm: any, preu: any): boolean {
    const gradeRank: any = {
      'A+': 1, 'A': 1, 'A-': 2, 'B+': 3, 'B': 5, 'B-': 6,
      'C+': 7, 'C': 8, 'C-': 9, 'D': 10, 'E': 11, 'G': 12,
      '4.0': 1, '3.67': 2, '3.33': 3, '3.0': 4, '3.00': 4, '2.0': 5, '1.0': 6
    };

    const subject = req.subject;
    const requiredGrade = req.grade;
    let studentGrade: string | undefined;

    if (req.graduate_type === 'SPM') {
      studentGrade = spm[subject];
      console.log("SPM Grade: ", studentGrade, "(", subject, ")");
    } else {
      studentGrade = preu[subject];
      console.log("PreU Grade: ", studentGrade, "(", subject, ")");
    }


    if (!studentGrade) return false;

    const studentRank = gradeRank[studentGrade.trim()] ?? 999;
    console.log("Student Rank: ", studentRank);
    const requiredRank = gradeRank[requiredGrade.trim()] ?? 999;
    console.log("Required Rank: ", requiredRank);

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
        this.cdr.detectChanges();
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
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'pending':
        return 'badge-pending';
      default:
        return 'badge-default';
    }
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
