import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Food } from 'src/app/model/Food';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-diet-form',
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css'],
})
export class DietFormComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  foods?: Food[];
  selectedFoodId?: number;
  dietFoods: Food[] = [];
  sum: { calorie: number, carbonhydrate: number, protein: number, fat: number } = {
    calorie: 0,
    carbonhydrate: 0,
    protein: 0,
    fat: 0
  };
  constructor(private dietService: DietService) {
    this.loadFoods();
  }

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Szénhidrát', 'Fehérje', 'Zsír'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['orange']
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  loadFoods() {
    this.dietService.getAllFoodWithoutPagination().subscribe((food: Food[]) => {
      this.foods = [...food];
    });
  }

  onSelected(value: any) {
    this.selectedFoodId = value.value;
  }

  addFoodToDiet() {
    this.foods?.forEach((elem) => {
      if (elem.id == this.selectedFoodId) {
        this.dietFoods.push(elem);
        this.sum.calorie += elem.calorie
        this.sum.carbonhydrate += elem.carbonhydrate;
        this.sum.protein += elem.protein;
        this.sum.fat += elem.fat;
      }
    });
    this.pieChartData.datasets[0].data = [];
    this.pieChartData.datasets[0].backgroundColor = [];
    this.pieChartData.datasets[0].backgroundColor = ['orange', 'lightgreen', 'lightblue'];
    this.pieChartData.datasets[0].data.push(this.sum.carbonhydrate, this.sum.protein, this.sum.fat);
    this.chart?.update();
  }

}
