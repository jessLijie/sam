import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToManage() {
    this.router.navigate(['/program-manage']);
  }

  goToView() {
    this.router.navigate(['/view-applicants']);
  }

  goToSort() {
    this.router.navigate(['/sort-applicants']);
  }
}
