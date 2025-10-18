import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    ToolbarComponent,
    SidebarComponent
  ],
  template: `
    <div class="app-container">
      <app-toolbar (toggleSidebar)="sidenav.toggle()"></app-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav [mode]="isSmallScreen ? 'over' : 'side'" [opened]="!isSmallScreen" class="sidenav">
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .sidenav-container {
      flex: 1;
    }
    .sidenav {
      width: 250px;
      border-right: 1px solid #ddd;
    }
    .main-content {
      background-color: #fafafa;
      min-height: 100%;
      padding: 16px;
    }
  `]
})
export class MainLayoutComponent {
  isSmallScreen = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }
}
