import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgToastService } from 'ng-angular-popup';
import { BaseChartDirective } from 'ng2-charts';
import { Diet } from 'src/app/model/Diet';
import { DietFood } from 'src/app/model/DietFood';
import { Food } from 'src/app/model/Food';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { User } from 'src/app/model/User';
import { Trainer } from 'src/app/model/Trainer';

@Component({
  selector: 'app-create-trainer',
  templateUrl: './create-trainer.component.html',
  styleUrls: ['./create-trainer.component.css']
})
export class CreateTrainerComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  foods?: Food[];
  dietFoods: DietFood[] = [];
  arr: Diet[] = [];
  selectedGuest?: number;
  trainer?:Trainer;
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
  constructor(
    private dietService: DietService,
    private toast: NgToastService,
    private authService: AuthService
  ) {
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
    this.authService.getAuthData().subscribe((response: User) => {
      this.trainer = response.trainer;
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
    labels: [],
    datasets: [
      {
        data: [1],
        backgroundColor: ['orange'],
      },
    ],
  };
  public pieChartPlugins = [DatalabelsPlugin];
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
      this.uploadChartData();
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
    this.uploadChartData();
  }

  saveEtrend() {
    if (this.dietForm.valid && this.dietFoods.length > 0) {
      if(!this.selectedGuest){
        this.toast.error({
          detail: 'Hiba',
          summary: 'Vendég kiválasztása kötelező!',
          duration: 2000,
          type: 'error',
        });
        return;
      }
      this.dietFoods.forEach((elem) => {
        const data: Diet = {
          foodId: elem.id as number,
          quantity: elem.quantity,
          type: elem.type,
          date: this.dietForm.get('date')?.value,
          guestId: this.selectedGuest,
          trainerId: this.trainer?.id,
        };
        this.arr.push(data);
      });
      this.dietService.saveDiet(this.arr).subscribe(() => {
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres étrend mentés!',
          duration: 2000,
          type: 'success',
        });
        this.dietForm.reset();
        this.etelForm.reset();
        this.selectedGuest = undefined;
        this.dietFoods = [];
      });
    }
  }

  uploadChartData() {
    const totalCalories =
      this.sum.carbonhydrate + this.sum.protein + this.sum.fat;
    const carbPercentage = (this.sum.carbonhydrate / totalCalories) * 100;
    const proteinPercentage = (this.sum.protein / totalCalories) * 100;
    const fatPercentage = (this.sum.fat / totalCalories) * 100;

    // Frissítsd a pieChartData-t a százalékos értékek alapján
    this.pieChartData.labels = [
      `Szénhidrát: ${carbPercentage.toFixed(0)}%`,
      `Fehérje: ${proteinPercentage.toFixed(0)}%`,
      `Zsír: ${fatPercentage.toFixed(0)}%`,
    ];
    // Frissítsd a pieChartData-t a sum alapján
    this.pieChartData.datasets[0].data = [
      this.sum.carbonhydrate,
      this.sum.protein,
      this.sum.fat,
    ];
    this.chart?.update();
  }
}
