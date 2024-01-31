import { Component } from '@angular/core';
import {
  faDrumstickBite,
  faFish,
  faHamburger,
} from '@fortawesome/free-solid-svg-icons';
import { CaloriesSum } from 'src/app/model/CaloriesSum';
import { DietSummary } from 'src/app/model/DietSummary';
import { ExerciseRegularity } from 'src/app/model/ExerciseRegularity';
import { MealFrequency } from 'src/app/model/MealFrequency';
import { RecentlyUsedExercise } from 'src/app/model/RecentlyUsedExercise';
import { AuthService } from 'src/app/service/auth.service';
import { DietService } from 'src/app/service/diet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  datasets: any = [];
  dietSummarys: DietSummary[] = [];
  labels: string[] = [];
  caloriesSum?: CaloriesSum;
  faHamburger = faHamburger;
  drumstickBite = faDrumstickBite;
  faFish = faFish;
  isTrainer = this.authService.isTrainer();
  mealFreqency: MealFrequency[] = [];
  pieDatasets: any = [];
  pieLabels: string[] = [];
  exerciseRegularity: ExerciseRegularity[] = [];
  recentlyUsedExercise: RecentlyUsedExercise[] = [];

  constructor(
    private authService: AuthService,
    private dietService: DietService
  ) {}

  ngOnInit() {
    const token = this.authService.getDecodedToken();

    if (!this.isTrainer) {
      this.createMacronutrienseStatistics(token);
      this.createCaloriesStatistics(token);
      this.createMealFrequency(token);
      this.createExerciseRegularity(token);
      this.createRecentlyUsedExercise(token);
    }
  }

  createMealFrequency(token: any) {
    this.dietService
      .getMealFrequency(token.sub)
      .subscribe((response: MealFrequency[]) => {
        this.mealFreqency = [...response];
        this.createPieChartDataset();
      });
  }

  createCaloriesStatistics(token: any) {
    this.dietService.getCalories(token.sub).subscribe(
      (response: CaloriesSum) => {
        this.caloriesSum = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createMacronutrienseStatistics(token: any) {
    this.dietService.getMacronutrienseStatistics(token.sub).subscribe(
      (result: DietSummary[]) => {
        this.dietSummarys = [...result];
        this.createBarDataset();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createExerciseRegularity(token: any) {
    this.dietService
      .getExerciseRegularity(token.sub)
      .subscribe((result: ExerciseRegularity[]) => {
        this.exerciseRegularity = [...result];
      });
  }

  createRecentlyUsedExercise(token: any){
    this.dietService
    .getRecentlyUsedExercise(token.sub)
    .subscribe((result: RecentlyUsedExercise[]) => {
      this.recentlyUsedExercise = [...result];
    });
  }

  createPieChartDataset() {
    this.mealFreqency.forEach((dataObj, index) => {
      this.pieLabels.push(dataObj.mealName);
      this.pieDatasets.push(dataObj.count);
    });
  }

  createBarDataset() {
    const ch_obj = { data: [], label: 'Szénhidrát' };
    const prot_obj = { data: [], label: 'Fehérje' };
    const fat_obj = { data: [], label: 'Zsír' };

    this.dietSummarys.forEach((dataObj, index) => {
      this.labels.push(this.getDayName(dataObj.day));
      //@ts-ignore
      ch_obj.data.push(dataObj.totalCarbonhydrate);
      //@ts-ignore
      prot_obj.data.push(dataObj.totalProtein);
      //@ts-ignore
      fat_obj.data.push(dataObj.totalFat);
      this.datasets.push(ch_obj, prot_obj, fat_obj);
    });
  }

 
  getRandomColor() {
    // Random RGBA szín generálása
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const alpha = Math.random().toFixed(2); // Két tizedes pontig
    return `rgba(${r},${g},${b},${alpha})`;
  }

  getDayName(type: string): string {
    switch (type) {
      case 'January':
        return 'Január';
      case 'February':
        return 'Február';
      case 'April':
        return 'Április';
      case 'May':
        return 'Május';
      case 'July':
        return 'Július';
      case 'June':
        return 'Június';
      case 'March':
        return 'Március';
      case 'August':
        return 'Augusztus';
      case 'October':
        return 'Október';
      default:
        return type;
    }
  }
}
