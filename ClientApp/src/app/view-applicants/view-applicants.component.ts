import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export interface Applicants {
  id: number;
  name: string;
  pre_u: string;
  spm_result: string;
  applied_program: string;
}

export interface Faculty {
  facultyCode: string;
  faculty: string;
}

export interface Program {
  code: string;
  name: string;
}

@Component({
  selector: 'app-view-applicants',
  standalone: true,
  templateUrl: './view-applicants.component.html',
  styleUrls: ['./view-applicants.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatExpansionModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatBadgeModule

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewApplicantsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'pre_u', 'spm_result', 'applied_program', 'action'];
  dataSource = new MatTableDataSource<Applicants>();
  public isModalOpen = false;
  public modalTitle = '';
  public modalContent: any = null;
  private apiUrl = 'https://localhost:7108/api/Application';
  // For the add modal:
  public isAddModalOpen = false;
  public isScanModalOpen = false;
  public addForm: FormGroup;
  programs: { [key: string]: Program[] } = {};
  faculties: Faculty[] = [];
  spmPdfFile: File | null = null;
  preUPdfFile: File | null = null;

  // Subject option lists
  spmSubjectOptions = [
    'Bahasa Melayu',
    'Bahasa Cina',
    'Bahasa Inggeris',
    'Sejarah',
    'Pendidikan Moral',
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'Additional Mathematics'
  ];
  stpmSubjectOptions = [
    'Mathematics (M)',
    'Mathematics (T)',
    'Physics',
    'Chemistry',
    'Biology',
    'Pengajian Am',
    'MUET'
  ];
  matriculationSubjectOptions = [
    'Physics',
    'Chemistry',
    'Biology',
    'MUET'
  ];
  foundationSubjectOptions = [
    'MUET',
    'Physics',
    'Chemistry',
    'Biology'
  ];
  diplomaSubjectOptions = [
    'MUET'
  ];

  // programs: { [key: string]: { code: string; name: string }[] } = {
  //   fc: [
  //     { code: 'UT6481001', name: 'Software Engineering' },
  //     { code: 'UT6481002', name: 'Data Engineering' },
  //     { code: 'UT6481003', name: 'Bioinformatics' },
  //     { code: 'UT6481004', name: 'Network and Cybersecurity' },
  //     { code: 'UT6481005', name: 'Graphics and Multimedia' },
  //   ],
  //   fkm: [
  //     { code: 'UT6521001', name: 'Pure Mechanics' },
  //     { code: 'UT6521003', name: 'Manufacturing' },
  //     { code: 'UT6521004', name: 'Industrial' },
  //     { code: 'UT6525001', name: 'Aerospace' },
  //     { code: 'UT6525002', name: 'Automotive' },
  //     { code: 'UT6525003', name: 'Offshore' },
  //   ],
  //   fke: [
  //     { code: 'UT6522002', name: 'Electrical Engineering' },
  //     { code: 'UT6523001', name: 'Electronic Engineering' },
  //     { code: 'UT6523002', name: 'Mechatronics Engineering' },
  //     { code: 'UT6523003', name: 'Biomedical Engineering' },
  //   ],
  // };

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      preUType: ['', Validators.required],
      faculty: ['', Validators.required],
      program_code: ['', Validators.required],
      icNumber: ['', Validators.required],
      address: [''],
      gender: [''],
      spmResults: this.fb.array([], Validators.required),
      preUResults: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchApplicants();
    this.fetchCourses();
    this.fetchFaculties();
  }

  fetchApplicants(): void {
    this.http.get<Applicants[]>(this.apiUrl).subscribe({
      next: (data: Applicants[]) => {
        this.dataSource.data = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching data:', err)
    });
  }

  getProgramName(code: string): string {
    for (const faculty in this.programs) {
      const found = this.programs[faculty].find(program => program.code === code);
      if (found) {
        return found.name;
      }
    }
    return code;
  }

  fetchFaculties(): void {
    this.http.get<Faculty[]>('https://localhost:7108/api/Course/faculties')
      .subscribe(response => {
        this.faculties = response;
      }, error => {
        console.error('Error fetching faculties:', error);
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


  openPreUResultModal(application: Applicants): void {
    this.http.get<any>(`${this.apiUrl}/${application.id}`).subscribe({
      next: (data) => {
        this.modalTitle = data.name + "'s " + data.preUType + " Result";
        try {
          this.modalContent = JSON.parse(data.preUResult);
        } catch (e) {
          console.error('Error parsing preUResult JSON', e);
          this.modalContent = data.preUResult;
        }
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching application details:', err)
    });
  }

  openSpmResultModal(application: Applicants): void {
    this.http.get<any>(`${this.apiUrl}/${application.id}`).subscribe({
      next: (data) => {
        this.modalTitle = data.name + "'s SPM Result";
        try {
          this.modalContent = JSON.parse(data.spmResult);
        } catch (e) {
          console.error('Error parsing spmResult JSON', e);
          this.modalContent = data.spmResult;
        }
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching application details:', err)
    });
  }

  openApplicantDetailModal(application: Applicants): void {
    this.http.get<any>(`${this.apiUrl}/detail/${application.id}`).subscribe({
      next: (data) => {
        try {
          data.spmResultParsed = JSON.parse(data.spmResult);
        } catch (e) {
          console.error('Error parsing spmResult JSON', e);
          data.spmResultParsed = data.spmResult;
        }
        try {
          data.preUResultParsed = JSON.parse(data.preUResult);
        } catch (e) {
          console.error('Error parsing preUResult JSON', e);
          data.preUResultParsed = data.preUResult;
        }
        this.modalTitle = 'Applicant Details';
        this.modalContent = data;
        this.isModalOpen = true;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error fetching detailed application info:', err)
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  get spmResults(): FormArray {
    return this.addForm.get('spmResults') as FormArray;
  }

  get preUResults(): FormArray {
    return this.addForm.get('preUResults') as FormArray;
  }

  @ViewChild('spmFileInput') spmFileInput!: ElementRef;
  scanSpmResult(): void {
    // this.spmResults.push(this.fb.group({
    //   subject: ['', Validators.required],
    //   grade: ['', Validators.required]
    // }));
    this.spmFileInput.nativeElement.click(); // triggers the file input
  }

  scanPreUResult(): void {
    this.preUResults.push(this.fb.group({
      subject: ['', Validators.required],
      grade: ['', Validators.required]
    }));
  }

  onSpmFileSelected(event: Event) {
    // this.spmResults.clear();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>(`${this.apiUrl}/scan/spm`, formData
      // ,{ responseType: 'text' as 'json' }
    ).subscribe({
      next: (res) => {
        // console.log('Extracted SPM:', res);
        // const results = res as Record<string, string>;
        // Object.entries(results).forEach(([subject, grade]) => {
        //   this.spmResults.push(
        //     this.fb.group({
        //       subject: [subject, Validators.required],
        //       grade: [grade as string, Validators.required]
        //     })
        //   );
        // });
        console.log('Extracted Text:', res.rawText);
        console.log('Parsed Result:', res.parsed);        // const extractedText = res as string;
        // console.log(extractedText);

        // Populate the form array with parsed SPM results
        Object.entries(res.parsed).forEach(([subject, grade]) => {
          this.spmResults.push(
            this.fb.group({
              subject: [subject, Validators.required],
              grade: [grade, Validators.required]
            })
          );
        });

        this.cdr.detectChanges();

    },
      error: (err) => {
        console.error('Error scanning SPM:', err);
        alert('Failed to scan SPM file. Please try again.');
      }
    });
}


addSpmResult(): void {
  this.spmResults.push(this.fb.group({
    subject: ['', Validators.required],
    grade: ['', Validators.required]
  }));
}

addPreUResult(): void {
  this.preUResults.push(this.fb.group({
    subject: ['', Validators.required],
    grade: ['', Validators.required]
  }));
}


removeSpmResult(index: number): void {
  this.spmResults.removeAt(index);
}
removePreUResult(index: number): void {
  this.preUResults.removeAt(index);
}

getAvailableSpmSubjects(index: number): string[] {
  const selectedSubjects = this.spmResults.controls
    .filter((ctrl, i) => i !== index)
    .map(ctrl => ctrl.get('subject')?.value)
    .filter(value => !!value);
  return this.spmSubjectOptions.filter(option => !selectedSubjects.includes(option));
}

getAvailablePreUSubjects(index: number): string[] {
  let options: string[] = [];
  const preUType = this.addForm.get('preUType')?.value;
  switch (preUType) {
    case 'STPM':
      options = this.stpmSubjectOptions;
      break;
    case 'Matriculation':
      options = this.matriculationSubjectOptions;
      break;
    case 'Foundation':
      options = this.foundationSubjectOptions;
      break;
    case 'Diploma':
      options = this.diplomaSubjectOptions;
      break;
    default:
      options = [];
  }
  const selectedSubjects = this.preUResults.controls
    .filter((ctrl, i) => i !== index)
    .map(ctrl => ctrl.get('subject')?.value)
    .filter(value => !!value);
  return options.filter(option => !selectedSubjects.includes(option));
}

onAddSubmit(): void {
  if(this.addForm.valid) {
  const newRecord = this.addForm.value;

  const spmResultsObj: { [subject: string]: string } = {};
  newRecord.spmResults.forEach((result: any) => {
    spmResultsObj[result.subject] = result.grade;
  });

  const preUResultsObj: { [subject: string]: string } = {};
  newRecord.preUResults.forEach((result: any) => {
    preUResultsObj[result.subject] = result.grade;
  });

  newRecord.spmResult = JSON.stringify(spmResultsObj);
  newRecord.preUResult = JSON.stringify(preUResultsObj);
  delete newRecord.spmResults;
  delete newRecord.preUResults;

  console.log('Submitting new record:', newRecord);
  this.http.post(this.apiUrl, newRecord).subscribe({
    next: (res) => {
      this.fetchApplicants();
      this.closeAddModal();
    },
    error: (err) => console.error('Error creating record:', err)
  });

  this.snackBar.open('Application created successfully!', 'Close', {
    duration: 2000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
  this.addForm.reset();
} else {
  console.log('Form is invalid');
  this.snackBar.open('Failed to create application.', 'Close', {
    duration: 2000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
  this.addForm.reset();
}
  }


getProgramsForFacultyDropdown(): { code: string; name: string } [] {
  const faculty = this.addForm.get('faculty')?.value;
  return this.programs[faculty] || [];
}

openAddModal(): void {
  this.addForm.reset();
  while(this.spmResults.length) { this.spmResults.removeAt(0); }
while (this.preUResults.length) { this.preUResults.removeAt(0); }
this.addSpmResult();
this.addPreUResult();
this.isAddModalOpen = true;
  }

openScanModal(): void {
  this.isScanModalOpen = true;
  //Only allow when there are scanned result
}

closeAddModal(): void {
  this.isAddModalOpen = false;
}


closeScanModal(): void {
  this.isScanModalOpen = false;
}

deleteApplicant(id: number): void {
  this.http.delete(`${this.apiUrl}/${id}`).subscribe({
    next: () => {
      this.fetchApplicants();
    },
    error: (err) => console.error('Error deleting record:', err)
  });
}

createApplicant(newApplicant: Applicants): void {
  this.http.post<Applicants>(this.apiUrl, newApplicant).subscribe({
    next: (createdRecord) => {
      this.fetchApplicants();
    },
    error: (err) => console.error('Error creating record:', err)
  });
}

updateApplicant(updatedApplicant: Applicants): void {
  this.http.put(`${this.apiUrl}/${updatedApplicant.id}`, updatedApplicant).subscribe({
    next: () => {
      this.fetchApplicants();
    },
    error: (err) => console.error('Error updating record:', err)
  });
}

}

