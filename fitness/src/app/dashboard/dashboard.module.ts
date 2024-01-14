import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';


@NgModule({
  declarations: [
    DashboardComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    NgChartsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: NgChartsConfiguration, useValue: { generateColors: false }
    }
  ],
})
export class DashboardModule { }
