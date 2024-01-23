import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  @Input() datasets: any;
  @Input() labels: any;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public pieChartPlugins = [DatalabelsPlugin];
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
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
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  ngOnInit(){
    this.pieChartData.labels = this.labels;
    this.pieChartData.datasets[0].data = this.datasets;
  }
}
