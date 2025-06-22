import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/auth/service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
  standalone: true,
  imports: [CommonModule,
      MatButtonModule,
      MatIconModule,
      MatSnackBarModule,
    RouterModule],
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(private router: Router,public authService: AuthService) { }
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  goToManage() {
    this.router.navigate(['/program-manage']);
  }

  goToView() {
    this.router.navigate(['/view-applicants']);
  }

  goToSort() {
    this.router.navigate(['/sort-applicants']);
  }

   logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
