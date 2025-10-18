import { Routes } from '@angular/router';

// Layout and Pages
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductFormComponent } from './components/products/product-form/product-form.component';
import { SalesListComponent } from './components/sales/sales-list/sales-list.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SalesFormComponent } from './components/sales/sales-form/sales-form.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      { path: 'dashboard', component: DashboardComponent },

      // Products
      { path: 'products', component: ProductListComponent },
      { path: 'products/add', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },

      // Sales
      { path: 'sales', component: SalesListComponent },
      { path: 'sales/new', component: SalesFormComponent },

      // Analytics
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'analytics/sales-by-category', component: AnalyticsComponent },
      // Reports
      { path: 'reports', component: ReportsComponent }
    ]
  }
];
