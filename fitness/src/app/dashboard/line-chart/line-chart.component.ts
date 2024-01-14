import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DietSummary } from 'src/app/model/DietSummary';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent {
  @Input() datasets: any;
  @Input() labels: any;

  public lineChartData?: ChartConfiguration['data'];

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'black',
        },
      },
    },
    plugins: {
      legend: { display: true },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit() {
    // Initialize the chart data once the inputs are available
    this.lineChartData = {
      datasets: this.datasets,
      labels: this.labels,
    };
  }
}
