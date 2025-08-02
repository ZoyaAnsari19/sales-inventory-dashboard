import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <!-- Sidebar Toggle -->
      <button mat-icon-button (click)="toggleSidebar.emit()" aria-label="Toggle sidebar">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- App Title -->
      <span class="title">Sales & Inventory Dashboard</span>

      <!-- Spacer -->
      <span class="spacer"></span>

      <!-- User Menu -->
      <button mat-button [matMenuTriggerFor]="userMenu" *ngIf="currentUser">
        <mat-icon>account_circle</mat-icon>
        <span>{{ currentUser.username }}</span>
      </button>

      <mat-menu #userMenu="matMenu">
        <button mat-menu-item disabled>
          <mat-icon>person</mat-icon>
          <span>{{ currentUser?.email }}</span>
        </button>
        <button mat-menu-item disabled>
          <mat-icon>badge</mat-icon>
          <span>Role: {{ currentUser?.role }}</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
    }

    .title {
      font-size: 1.25rem;
      font-weight: 500;
      margin-left: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    @media (max-width: 768px) {
      .title {
        font-size: 1rem;
      }
    }
  `]
})
export class ToolbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
