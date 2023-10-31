import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import { BaseChartDirective } from 'ng2-charts';
import { Diet } from '../../model/Diet';
import { DietFood } from '../../model/DietFood';
import { Food } from '../../model/Food';
import { DietService } from '../../service/diet.service';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-diet-form',
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css'],
})
export class DietFormComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  foods?: Food[];
  dietFoods: DietFood[] = [];
  arr:Diet[] = [];
  sum: {
    calorie: number;
    carbonhydrate: number;
    protein: number;
    fat: number;
  } = {
    calorie: 0,
    carbonhydrate: 0,
    protein: 0,
    fat: 0,
  };
  etelForm: FormGroup;
  dietForm: FormGroup;
  constructor(private dietService: DietService,
    private toast: NgToastService,
    private authService: AuthService) {
    this.loadFoods();
    this.etelForm = new FormGroup({
      etel: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
    });
    this.dietForm = new FormGroup({
      date: new FormControl('', [Validators.required]),
    });
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
        backgroundColor: ['orange'],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  loadFoods() {
    this.dietService.getAllFoodWithoutPagination().subscribe((food: Food[]) => {
      this.foods = [...food];
    });
  }

  addFoodToDiet() {
    if (this.etelForm.valid) {
      this.foods?.forEach((elem) => {
        if (elem.id == this.etelForm.get('etel')?.value) {
          const data: DietFood = {
            id: elem.id,
            name: elem.name,
            calorie:
              (elem.calorie / 100) * this.etelForm.get('quantity')?.value,
            carbonhydrate:
              (elem.carbonhydrate / 100) * this.etelForm.get('quantity')?.value,
            protein:
              (elem.protein / 100) * this.etelForm.get('quantity')?.value,
            fat: (elem.fat / 100) * this.etelForm.get('quantity')?.value,
            type: this.etelForm.get('type')?.value,
            quantity: this.etelForm.get('quantity')?.value,
          };
          this.dietFoods.push(data);
          this.sum.calorie += data.calorie;
          this.sum.carbonhydrate += data.carbonhydrate;
          this.sum.protein += data.protein;
          this.sum.fat += data.fat;
        }
      });
      this.pieChartData.datasets[0].data = [];
      this.pieChartData.datasets[0].backgroundColor = [];
      this.pieChartData.datasets[0].backgroundColor = [
        'orange',
        'lightgreen',
        'lightblue',
      ];
      this.pieChartData.datasets[0].data.push(
        this.sum.carbonhydrate,
        this.sum.protein,
        this.sum.fat
      );
      this.chart?.update();
      this.etelForm.reset();
    }
  }

  translateType(type: string) {
    switch (type) {
      case 'LUNCH':
        return 'Ebéd';
      case 'BREAKFAST':
        return 'Reggeli';
      case 'DINNER':
        return 'Vacsora';
      case 'SNACK':
        return 'Snack';
      default:
        return '';
    }
  }

  removeEtelFromDiet(food: DietFood) {
    console.log(food);

    // Szűrd ki azokat a DietFood objektumokat, amelyek nem egyeznek a törölni kívánt objektummal
    this.dietFoods = this.dietFoods.filter((item) => item !== food);

    // Frissítsd a sum objektumot a törölt elem attribútumainak eltávolításával
    this.sum.calorie -= food.calorie;
    this.sum.carbonhydrate -= food.carbonhydrate;
    this.sum.protein -= food.protein;
    this.sum.fat -= food.fat;

    // Frissítsd a pieChartData-t a sum alapján
    this.pieChartData.datasets[0].data = [
      this.sum.carbonhydrate,
      this.sum.protein,
      this.sum.fat,
    ];
    this.chart?.update();
  }

  saveEtrend() {
    if (this.dietForm.valid && this.dietFoods.length > 0) {
      const token = this.authService.getDecodedToken();
      this.dietFoods.forEach((elem) => {
        const data: Diet = {
          foodId: elem.id as number,
          quantity: elem.quantity,
          type: elem.type,
          date: this.dietForm.get('date')?.value,
          userId: token.sub,
          trainerId: null,
        };
        this.arr.push(data);
      });
      console.log(this.arr);
      this.dietService.saveDiet(this.arr).subscribe(() => {
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres étrend mentés!',
          duration: 2000,
          type: 'success',
        });
        this.dietForm.reset();
        this.etelForm.reset();
        this.dietFoods = [];
      });
    }
  }
}
