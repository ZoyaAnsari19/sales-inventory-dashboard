import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <mat-nav-list>
      <a mat-list-item
         routerLink="/dashboard"
         routerLinkActive="active-link"
         [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </a>

      <a mat-list-item
         routerLink="/products"
         routerLinkActive="active-link"
         [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>inventory_2</mat-icon>
        <span>Products</span>
      </a>

      <a mat-list-item
         routerLink="/sales"
         routerLinkActive="active-link"
         [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>point_of_sale</mat-icon>
        <span>Sales</span>
      </a>

      <a mat-list-item
         routerLink="/analytics"
         routerLinkActive="active-link"
         [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>analytics</mat-icon>
        <span>Analytics</span>
      </a>

      <a mat-list-item
         routerLink="/reports"
         routerLinkActive="active-link"
         [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>bar_chart</mat-icon>
        <span>Reports</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    mat-icon {
      margin-right: 10px;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .active-link {
      background-color: rgba(0, 0, 0, 0.08);
      font-weight: bold;
      border-radius: 4px;
    }
  `]
})
export class SidebarComponent {}
