import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartType, ChartOptions, registerables } from 'chart.js';
import { SalesService } from '../../services/sales.service';
import { MatButtonModule } from '@angular/material/button';
import { TopProduct } from '../../models/top-product.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    BaseChartDirective
  ],
  template: `
  <div class="analytics-container">
    <h1>Sales Analytics</h1>

    <mat-tab-group>
      <!-- Top Selling Products Tab -->
      <mat-tab label="Top Selling Products">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Top 5 Selling Products</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="topChartData"
              [options]="chartOptions"
              [type]="currentChartType">
            </canvas>

            <div class="chart-switch-buttons">
              <button
                mat-raised-button
                color="primary"
                (click)="switchChart('bar')"
                [disabled]="currentChartType === 'bar'">
                Bar Chart
              </button>
              <button
                mat-raised-button
                color="accent"
                (click)="switchChart('pie')"
                [disabled]="currentChartType === 'pie'">
                Pie Chart
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-tab>

      <!-- Sales by Category Tab -->
      <mat-tab label="Sales by Category">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Sales Distribution by Category</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas baseChart
                [data]="categoryChartData"
                [options]="categoryChartOptions"
                [type]="categoryChartType">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-tab>

      <!-- Monthly Trends Tab -->
      <mat-tab label="Monthly Trends">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Monthly Sales Trends</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas baseChart
                [data]="monthlyChartData"
                [options]="monthlyChartOptions"
                [type]="monthlyChartType">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-tab>
    </mat-tab-group>
  </div>
  `,
  styles: [`
    .chart-switch-buttons {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
    }

    .chart-switch-buttons button {
        font-weight: 600;
        border-radius: 8px;
        padding: 6px 16px;
        text-transform: capitalize;
    }

    .analytics-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .analytics-container h1 {
      color: #3f51b5;
      margin-bottom: 24px;
      text-align: center;
    }
    .chart-card {
      margin-top: 16px;
    }
    .chart-container {
      position: relative;
      height: 400px;
      width: 100%;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  currentChartType: ChartType = 'bar';
  categoryChartType: ChartType = 'pie';
  monthlyChartType: ChartType = 'line';

  topChartData: ChartData<'bar' | 'pie'> = {
    labels: [],
    datasets: [{
      label: 'Units Sold',
      data: [],
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043']
    }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  categoryChartData: ChartData<'pie'> = {
    labels: ['Electronics', 'Clothing', 'Accessories', 'Home'],
    datasets: [{
      data: [120, 80, 45, 60],
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF6384']
    }]
  };

  categoryChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sales by Category'
      }
    }
  };

  monthlyChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Sales',
      data: [5000, 7000, 6000, 8000, 7500, 9000],
      borderColor: '#42A5F5',
      tension: 0.3,
      fill: false
    }]
  };

  monthlyChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Trends'
      }
    },
    scales: {
      x: {},
      y: {}
    }
  };

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadTopSellingProducts();
  }

  switchChart(type: ChartType): void {
    this.currentChartType = type;
  }
loadTopSellingProducts(): void {
  this.salesService.getTopSellingProducts(5).subscribe((topProducts: TopProduct[]) => {
    console.log('🔥 API Response:', topProducts);

    this.topChartData.labels = topProducts.map(p => p.productName);
    this.topChartData.datasets[0].data = topProducts.map(p => p.totalSold);

    console.log('✅ Chart Labels:', this.topChartData.labels);
    console.log('✅ Chart Data:', this.topChartData.datasets[0].data);
  });
}

}
