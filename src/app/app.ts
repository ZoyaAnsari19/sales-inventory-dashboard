import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class App {
  title = 'sales-inventory-dashboard';
}