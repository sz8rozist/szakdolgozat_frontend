import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent {
  @Input() datasets: any;
  @Input() labels: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        color: 'white',
      anchor: 'end',
      align: 'start',
      offset: 0,
      borderWidth: 2,
      borderColor: '#F44336',
      borderRadius: 4,
      backgroundColor: '#F44336',
        formatter: (value: any, ctx: any) => {
          return ctx.dataset.label;
        },
      }
      
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DatalabelsPlugin];

  public barChartData?: ChartData<'bar'>;

  ngOnInit(){
    this.barChartData = {
      datasets: this.datasets,
      labels: this.labels,
    };
  }
}
