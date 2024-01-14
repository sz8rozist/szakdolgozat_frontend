import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgToastService } from 'ng-angular-popup';
import { BaseChartDirective } from 'ng2-charts';
import { Diet } from '../../model/Diet';
import { DietFood } from '../../model/DietFood';
import { Food } from '../../model/Food';
import { DietService } from '../../service/diet.service';
import { AuthService } from '../../service/auth.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { DietRecommendationService } from 'src/app/service/diet-recommendation.service';
import { DietRecommendation } from 'src/app/model/DietRecommendation';
@Component({
  selector: 'app-diet-form',
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css'],
})
export class DietFormComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  foods?: Food[];
  dietFoods: DietFood[] = [];
  arr: Diet[] = [];
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
  recommendation?: DietRecommendation;
  percentages: { name: string; value: number }[] = [
    { name: 'Kalória', value: 0 },
    { name: 'Szénhidrát', value: 0 },
    { name: 'Fehérje', value: 0 },
    { name: 'Zsír', value: 0 },
  ];
  constructor(
    private dietService: DietService,
    private toast: NgToastService,
    private authService: AuthService,
    private dietRecommendationService: DietRecommendationService
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
      this.calculatePercentages();

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
    // Szűrd ki azokat a DietFood objektumokat, amelyek nem egyeznek a törölni kívánt objektummal
    this.dietFoods = this.dietFoods.filter((item) => item !== food);

    // Frissítsd a sum objektumot a törölt elem attribútumainak eltávolításával
    this.sum.calorie -= food.calorie;
    this.sum.carbonhydrate -= food.carbonhydrate;
    this.sum.protein -= food.protein;
    this.sum.fat -= food.fat;
    this.calculatePercentages();
    this.uploadChartData();
  }

  saveEtrend() {
    if (this.dietForm.valid && this.dietFoods.length > 0) {
      if (
        this.recommendation &&
        this.sum.calorie > this.recommendation.calorie
      ) {
        this.toast.warning({
          detail: 'Figyelmeztetés',
          summary: 'Figyelem túllépted a napi tápértéket!',
          duration: 2000,
          type: 'warning',
        });
        return;
      }
      const token = this.authService.getDecodedToken();
      const authData = this.authService.getUserById(token.sub).toPromise();
      authData
        .then((authData) => {
          this.dietFoods.forEach((elem) => {
            const data: Diet = {
              foodId: elem.id as number,
              quantity: elem.quantity,
              type: elem.type,
              date: this.dietForm.get('date')?.value,
              guestId: authData?.guest.id,
              trainerId: null,
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
            this.dietFoods = [];
          });
        })
        .catch((error) => {
          // Hibakezelés
          console.error(error);
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

  onDateChange(event: any) {
    const date = event.target.value;
    const token = this.authService.getDecodedToken();
    //Itt még ellenőrizni kéne hogy személyi edző nem e csinált már erre a napra étrendet?
    this.dietRecommendationService.getRecommendation(token.sub, date).subscribe(
      (result: DietRecommendation) => {
        console.log(result);
        this.recommendation = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  calculatePercentages() {
    if (this.recommendation) {
      const percentageCalorie =
        (this.sum.calorie / this.recommendation.calorie) * 100;
      const percentageCarbonhydrate =
        (this.sum.carbonhydrate / this.recommendation.carbonhydrate) * 100;
      const percentageProtein =
        (this.sum.protein / this.recommendation.protein) * 100;
      const percentageFat = (this.sum.fat / this.recommendation.fat) * 100;
      // Beállítjuk a kiszámolt százalékokat a percentages tömbben
      this.percentages[0].value = Math.min(percentageCalorie, 100);
      this.percentages[1].value = Math.min(percentageCarbonhydrate, 100);
      this.percentages[2].value = Math.min(percentageProtein, 100);
      this.percentages[3].value = Math.min(percentageFat, 100);
    }
  }

  getRecommendationLabel(percentageName: string): string {
    if (this.recommendation) {
      switch (percentageName) {
        case 'Kalória':
          return this.recommendation.calorie.toString();
        case 'Szénhidrát':
          return this.recommendation.carbonhydrate.toString();
        case 'Fehérje':
          return this.recommendation.protein.toString();
        case 'Zsír':
          return this.recommendation.fat.toString();
        default:
          return '';
      }
    }
    return '';
  }
}
