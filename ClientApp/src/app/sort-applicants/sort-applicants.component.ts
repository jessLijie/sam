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

@Component({
  selector: 'app-sort-applicants',
  standalone: true,
  imports: [ CommonModule,
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
    MatBadgeModule],
    templateUrl: './sort-applicants.component.html',
    styleUrls: ['./sort-applicants.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SortApplicantsComponent {
  selectedEmail: string = '';
  emailMessage: string = 'test123';

  constructor(private http: HttpClient) {}

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
        alert('Error sending email:'+ error);
      });
  }
}
