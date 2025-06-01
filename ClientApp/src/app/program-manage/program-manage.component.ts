import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

export interface Faculty {
  facultyCode: string;
  faculty: string;
}

export interface Program {
  code: string;
  name: string;
}

interface Subject {
  id: number;
  category: string;
  subjectName: string;
}

export interface SpecialEntryRequirement {
  id: number;
  category: string;
  requirement: string;
  grade: string;
}


@Component({
  selector: 'app-program-manage',
  standalone: true,
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
  templateUrl: './program-manage.component.html',
  styleUrls: ['./program-manage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramManageComponent implements AfterViewInit {
  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private fb: FormBuilder

  ) {
    this.getGeneralRequirement();
    this.createForm = this.fb.group({
      graduate_type: ['', Validators.required],
      requirement_type: ['', Validators.required],
      grade: ['', Validators.required],
      subject: ['', Validators.required],
      faculty: [''],
      program_code: [''],
    });
    this.createForm.get('type')?.valueChanges.subscribe(value => {
      this.isSpecialSelected = value === 'special';
      this.isSPM = value === 'SPM';
    });
    this.subjectForm = this.fb.group({
      category: ['', Validators.required],
      subjectName: ['', Validators.required]
    });
    this.quotaForm = this.fb.group({
      quota: ['', Validators.required],
      program_code: ['', Validators.required],
      faculty: ['', Validators.required]
    });
    this.fetchCourses();
    this.fetchFaculties();
    this.fetchCategories();
    this.fetchAllSubjects();
    this.fetchCoursesQuota();
    this.fetchExistingEntryRequirements();

  }
  createForm: FormGroup;
  isSpecialSelected: boolean = false;
  isSPM: boolean = false;
  isSTPM: boolean = false;
  isFoundation: boolean = false;
  isMatriculation: boolean = false;
  isDiploma: boolean = false;
  isDuplicateEntry: boolean = false;
  displayedColumns: string[] = ['graduate_type', 'requirement', 'grade', 'action'];
  displayedCourseColumns = ['category', 'subjectName', 'actions'];
  generalRequirement: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  subjectDataSource = new MatTableDataSource<Subject>([]);
  selectedFaculty: string | null = null;
  selectedFacultyDropdown: string | null = null;
  selectedProgramCode: string | null = null;
  specialRequirements: { [programCode: string]: SpecialEntryRequirement[] } = {};
  editingRowIndex: number | null = null;
  updatedGrade: string | null = null;
  editingSpecialRowIndex: number | null = null;
  updatedSpecialGrade: string | null = null;
  isCreateModalOpen: boolean = false;
  errorMessage: string = '';
  programs: { [key: string]: Program[] } = {};
  faculties: Faculty[] = [];
  categories: string[] = [];
  subjects: Subject[] = [];
  selectedCategory: string = '';
  selectedSubject: string = '';
  selectedGrade: string = '';
  grades: string[] = [];
  spmGrades = ["A+", "A", "A-", "B+", "B", "C"];
  otherGrades = ["4.00", "3.67", "3.33", "3.00", "2.67"];
  muetGrades = ["5.5", "5.0", "4.0", "3.0", "2.0", "1.0"];
  isSubjectModalOpen: boolean = false;
  isCourseModalOpen: boolean = false;
  showSubjects: boolean = false;
  subjectForm: FormGroup;
  quotaForm: FormGroup;
  sortedSubjects: Subject[] = [];
  selectedSubjectId: number | null = null;
  programsQuota: any[] = [];
  updatedProgramsQuota: { code: string; quota: number }[] = [];
  existingEntryRequirements: any[] = [];


  fetchExistingEntryRequirements(): void {
    this.http.get<any[]>('https://wongjie-001-site1.qtempurl.com/api/EntryRequirement')
      .subscribe(response => {
        this.existingEntryRequirements = response;
      }, error => {
        console.error('Error fetching entry requirements:', error);
      });
  }

  checkForDuplicateEntry(): void {
    const formValue = this.createForm.value;

    this.errorMessage = '';
    this.isDuplicateEntry = false;

    for (let entry of this.existingEntryRequirements) {
      const sameCategory = entry.graduate_type === formValue.graduate_type;
      const sameSubject = entry.subject === formValue.subject;
      const sameType = entry.requirement_type === formValue.requirement_type;

      let isDuplicate = sameCategory && sameSubject && sameType;

      if (formValue.requirement_type === 'special') {
        const sameFaculty = entry.faculty === formValue.faculty;
        const sameProgram = entry.program_code === formValue.program_code;
        isDuplicate = isDuplicate && sameFaculty && sameProgram;
      }

      if (isDuplicate) {
        this.isDuplicateEntry = true;
        this.errorMessage = '**This entry requirement already exists.';
        break;
      }
    }
  }


  openSubjectModal() {
    this.isSubjectModalOpen = true;
    this.subjectForm.reset();
  }

  openCourseModal() {
    this.isCourseModalOpen = true;
  }

  closeCourseModal() {
    this.isCourseModalOpen = false;
  }

  closeSubjectModal() {
    this.isSubjectModalOpen = false;
    this.subjectForm.reset();
  }

  saveSubject(): void {
    if (this.subjectForm.invalid) return;

    const subjectData: Subject = this.subjectForm.value;

    this.http.post('https://wongjie-001-site1.qtempurl.com/api/Course/add', subjectData)
      .subscribe(() => {
        this.snackBar.open('Subject added successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.fetchAllSubjects();
        this.subjectForm.reset();
      }, error => console.error('Error adding subject:', error));
  }

  deleteSubject(subjectId: number): void {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    this.http.delete(`https://wongjie-001-site1.qtempurl.com/api/Course/delete/${subjectId}`)
      .subscribe(() => {
        this.snackBar.open('Subject deleted successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.fetchAllSubjects();
      }, error => console.error('Error deleting subject:', error));
  }

  fetchCategories(): void {
    this.http.get<string[]>('https://wongjie-001-site1.qtempurl.com/api/Course/categories')
      .subscribe(response => {
        this.categories = response;
      }, error => {
        console.error('Error fetching categories:', error);
      });
  }
  sortSubjects(): void {
    this.sortedSubjects = [...this.subjects].sort((a, b) => a.category.localeCompare(b.category));
  }

  toggleViewSubjects(): void {
    this.showSubjects = !this.showSubjects;
    if (this.showSubjects) {
      this.sortSubjects();
    }
  }

  fetchAllSubjects(): void {
    this.http.get<Subject[]>('https://wongjie-001-site1.qtempurl.com/api/Course/subjects')
      .subscribe(response => {
        this.subjects = response;
        this.subjectDataSource = new MatTableDataSource(response);
        this.cdr.detectChanges();
        if (this.subjectSort) {
          console.log("Assigning sort to subjectDataSource");
          this.subjectDataSource.sort = this.subjectSort;
        } else {
          console.warn("MatSort not available at ngAfterViewInit");
        }

      }, error => {
        console.error('Error fetching subjects:', error);
      });
  }

  fetchSubjects(category: string): void {
    this.http.get<Subject[]>(`https://wongjie-001-site1.qtempurl.com/api/Course/subjects/${category}`)
      .subscribe(response => {
        this.subjects = response;
      }, error => {
        console.error('Error fetching subjects:', error);
      });
  }

  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.fetchSubjects(this.selectedCategory);
      this.selectedSubject = '';
      this.setGradeOptions();
    }
    this.checkForDuplicateEntry();

  }

  onSubjectChange(): void {
    this.setGradeOptions();
    this.checkForDuplicateEntry();

  }

  setGradeOptions(): void {
    if (this.selectedCategory === 'SPM') {
      this.grades = this.spmGrades;
    } else if (this.selectedSubject === 'MUET') {
      this.grades = this.muetGrades;
    } else {
      this.grades = this.otherGrades;
    }
  }

  fetchCourses(): void {
    this.http.get<{ [key: string]: Program[] }>('https://wongjie-001-site1.qtempurl.com/api/Course/courses')
      .subscribe(response => {
        this.programs = response;
      }, error => {
        console.error('Error fetching courses:', error);
      });
  }

  fetchCoursesQuota(): void {
    const facultyMap: { [key: string]: string } = {
      fc: 'Faculty of Computing',
      fke: 'Faculty of Electrical Engineering',
      fkm: 'Faculty of Mechanical Engineering',
      fabu: 'Faculty of Built Environment and Surveying',
    };

    this.http.get<{ [key: string]: Program[] }>('https://wongjie-001-site1.qtempurl.com/api/Course/courses')
      .subscribe(response => {
        const allPrograms = [];

        for (const facultyKey in response) {
          if (response.hasOwnProperty(facultyKey)) {
            const facultyName = facultyMap[facultyKey] || facultyKey;

            const facultyPrograms = response[facultyKey].map(p => ({
              ...p,
              faculty: facultyName
            }));

            allPrograms.push(...facultyPrograms);
          }
        }

        this.programsQuota = allPrograms;
      }, error => {
        console.error('Error fetching courses:', error);
      });
  }

  updateQuota(code: string, quota: number) {
    const existing = this.updatedProgramsQuota.find(p => p.code === code);
    if (existing) {
      existing.quota = quota;
    } else {
      this.updatedProgramsQuota.push({ code, quota });
    }
    console.log('Updated Programs Quota:', this.updatedProgramsQuota);
  }


  saveQuota() {
    console.log('Updated Quotas:', this.updatedProgramsQuota);
    if (this.updatedProgramsQuota.length === 0) {
      console.error('No quotas to update!');
      return;
    }

    this.http.put('https://wongjie-001-site1.qtempurl.com/api/Course/updateQuotas', this.updatedProgramsQuota)
      .subscribe(response => {
        console.log('Quota updated successfully:', response);
        this.closeCourseModal();
        this.snackBar.open('Quota edited successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }, error => {
        console.error('Failed to update quota:', error);
      });
  }


  fetchFaculties(): void {
    this.http.get<Faculty[]>('https://wongjie-001-site1.qtempurl.com/api/Course/faculties')
      .subscribe(response => {
        this.faculties = response;
      }, error => {
        console.error('Error fetching faculties:', error);
      });
  }

  getGeneralRequirement() {
    this.http.get('https://wongjie-001-site1.qtempurl.com/api/EntryRequirement/general')
      .subscribe((res: any) => {
        this.generalRequirement = new MatTableDataSource(res);
        if (this.generalSort) {
          this.generalRequirement.sort = this.generalSort;
        }
        this.cdr.detectChanges();
      });
  }

  @ViewChild('generalSort', { static: false }) generalSort: MatSort | undefined;
  @ViewChild('subjectSort', { static: false }) subjectSort: MatSort | undefined;
  ngAfterViewInit() {
    if (this.generalSort) {
      this.generalRequirement.sort = this.generalSort;
    }
    if (this.subjectSort) {
      this.subjectDataSource.sort = this.subjectSort;
    }
  }

  getSpecialRequirements(programCode: string) {
    this.http.get<SpecialEntryRequirement[]>(`https://wongjie-001-site1.qtempurl.com/api/EntryRequirement/special/${programCode}`)
      .subscribe((data) => {
        this.specialRequirements[programCode] = data;
        this.cdr.detectChanges();
      });
  }

  startEditing(rowIndex: number, currentGrade: string) {
    this.editingRowIndex = rowIndex;
    this.updatedGrade = currentGrade;
  }

  saveChanges(rowIndex: number) {
    const row = this.generalRequirement.data[rowIndex];
    const updatedRequirement = {
      id: row.id,
      grade: this.updatedGrade,
      subject: row.subject,
      requirement_type: row.requirement_type,
      graduate_type: row.graduate_type,
    };

    this.http.put(`https://wongjie-001-site1.qtempurl.com/api/EntryRequirement/update/${row.id}`, updatedRequirement).subscribe(
      (res) => {
        console.log('Update successful:', res);
        this.snackBar.open('Grade edited successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.generalRequirement.data[rowIndex].grade = this.updatedGrade;
        this.editingRowIndex = null;
        this.updatedGrade = null;
        console.log(this.editingRowIndex, this.updatedGrade);
        this.cdr.markForCheck();
      },
      (err) => {
        console.error('Update failed:', err);
      }
    );
  }

  startEditingSpecial(programCode: string, rowIndex: number, currentGrade: string) {
    this.editingSpecialRowIndex = rowIndex;
    this.updatedSpecialGrade = currentGrade;
  }

  saveSpecialChanges(programCode: string, rowIndex: number) {
    const specialRequirement = this.specialRequirements[programCode][rowIndex];
    const updatedRequirement = {
      ...specialRequirement,
      grade: this.updatedSpecialGrade,
    };

    this.http.put(`https://wongjie-001-site1.qtempurl.com/api/EntryRequirement/update/${specialRequirement.id}`, updatedRequirement).subscribe(
      (res) => {
        console.log('Special Requirement Update Successful:', res);
        this.snackBar.open('Grade edited successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        if (this.updatedSpecialGrade !== null) {
          this.specialRequirements[programCode][rowIndex].grade = this.updatedSpecialGrade;
        }
        this.editingSpecialRowIndex = null;
        this.updatedSpecialGrade = null;
        this.cdr.markForCheck();
      },
      (err) => {
        console.error('Update failed:', err);
      }
    );
  }

  confirmDelete(id: number, programCode?: string) {
    const confirmResult = window.confirm("Are you sure you want to delete this entry?");
    if (confirmResult) {
      this.deleteEntryRequirement(id, programCode);
    }
  }

  deleteEntryRequirement(id: number, programCode?: string) {
    this.http.delete(`https://wongjie-001-site1.qtempurl.com/api/EntryRequirement/delete/${id}`, { responseType: 'text' })
      .subscribe(
        (response) => {
          console.log('Delete successful:', response);
          this.generalRequirement.data = this.generalRequirement.data.filter(item => item.id !== id);
          if (programCode) {
            this.specialRequirements[programCode] = this.specialRequirements[programCode].filter(item => item.id !== id);
          }

          this.snackBar.open('Entry requirement deleted successfully!', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Delete failed:', error);
          this.snackBar.open('Failed to delete entry requirement.', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      );
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.createForm.reset();
  }

  submitEntry(): void {
    if (this.createForm.invalid) {
      return;
    }

    const formData = this.createForm.value;

    this.http.post('https://wongjie-001-site1.qtempurl.com/api/EntryRequirement/create', formData)
      .subscribe(
        (response) => {
          console.log('Form submitted successfully!', response);
          this.snackBar.open('Form submitted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.closeCreateModal();
          this.getGeneralRequirement();
          this.getSpecialRequirements(formData.program_code);
        },
        (error) => {
          console.error('Error submitting the form:', error);

          // Check if the error is a constraint violation (duplicate graduate_type + requirement_type)
          if (error.status === 409) {
            this.errorMessage = error.error;  // Set the error message from the backend
          } else {
            this.errorMessage = 'An error occurred while submitting the form.';
          }
        }
      );
  }

  // Method to change behavior when type is selected as 'special'
  onTypeChange(event: any) {
    if (event.value === 'special') {
      this.isSpecialSelected = true;
    } else {
      this.isSpecialSelected = false;
    }
    this.checkForDuplicateEntry();
  }
  onFacultyOrProgramChange() {
    this.checkForDuplicateEntry();
  }

  onTypeChangeSubject(event: any) {
    this.isSPM = event.value === 'SPM';
    this.isSTPM = event.value === 'STPM';
    this.isFoundation = event.value === 'Foundation';
    this.isDiploma = event.value === 'Diploma';
    this.isMatriculation = event.value === 'Matriculation';
  }

  clearFilter(): void {
    this.selectedFaculty = null;
    this.selectedProgramCode = null;
  }

  getProgramsForFaculty(): Program[] {
    return this.selectedFaculty ? this.programs[this.selectedFaculty] : [];
  }

  getProgramsForFacultyDropdown() {
    const faculty = this.createForm.value.faculty;
    return this.programs[faculty] || [];
  }

  selectProgram(programCode: string): void {
    this.selectedProgramCode = programCode;
    this.getSpecialRequirements(programCode);
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'SPM':
        return 'spm-tag';
      case 'STPM':
        return 'stpm-tag';
      case 'Foundation':
        return 'muet-tag';
      case 'Diploma':
        return 'diploma-tag';
      case 'Matriculation':
        return 'matriculation-tag';
      default:
        return '';
    }
  }

  // faculties: Faculty[] = [
  //   { value: 'fc', viewValue: 'Faculty of Computing' },
  //   { value: 'fkm', viewValue: 'Faculty of Mechanical Engineering' },
  //   { value: 'fke', viewValue: 'Faculty of Engineering' },
  // ];

  // programs: { [key: string]: Program[] } = {
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

}
