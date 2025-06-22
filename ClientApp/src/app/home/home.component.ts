import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service';

export interface Program {
  code: string;
  name: string;
  quota: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule
  ],
})
export class HomeComponent {
  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef, public authService: AuthService) {

  }
  summaryData: any = {};
  recentApplications: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'program', 'program_name', 'date'];
  totalApplicants = 0;
  approvedApplicants = 0;
  topProgram = '';
  programs: { [key: string]: Program[] } = {};

  ngOnInit() {
    this.fetchCourses();

    this.http.get('https://wongjie-001-site1.qtempurl.com/api/Application/summary').subscribe((data: any) => {
      this.summaryData = data;
      this.totalApplicants = data.totalApplicants;
      this.approvedApplicants = data.approvedApplicants;
      this.topProgram = data.topProgram;
      this.recentApplications = data.recentApplications;
    });
  }

  fetchCourses(): void {
    this.http.get<{ [key: string]: Program[] }>('https://wongjie-001-site1.qtempurl.com/api/Course/courses')
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




}
