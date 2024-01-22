import { Component } from '@angular/core';
import {  faDrumstickBite, faFish, faHamburger } from '@fortawesome/free-solid-svg-icons';
import { CaloriesSum } from 'src/app/model/CaloriesSum';
import { DietSummary } from 'src/app/model/DietSummary';
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
  constructor(
    private authService: AuthService,
    private dietService: DietService
  ) {}

  ngOnInit() {
    const token = this.authService.getDecodedToken();
    console.log(token);
    this.dietService.getMacronutrienseStatistics(token.sub).subscribe(
      (result: DietSummary[]) => {
        this.dietSummarys = [...result];
        this.createDataset();
      },
      (error) => {
        console.log(error);
      }
    );
    this.dietService.getCalories(token.sub).subscribe((response: CaloriesSum) =>{
      this.caloriesSum = response;
    }, (error) =>{console.log(error)})
  }

  createDataset() {
    console.log(this.dietSummarys);
    this.dietSummarys.forEach((dataObj, index) => {
      this.labels.push(this.getDayName(dataObj.day));
      if (index === 0) {
        // Első elem esetén létrehozzuk az adatokat
        this.datasets.push({
          data: [dataObj.totalProtein],
          label: 'Fehérje',
          backgroundColor: this.getRandomColor(),
          borderColor: this.getRandomColor(),
          pointBackgroundColor: this.getRandomColor(),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.getRandomColor(),
          fill: 'origin',
        });
        this.datasets.push({
          data: [dataObj.totalCarbonhydrate],
          label: 'Szénhidrát',
          backgroundColor: this.getRandomColor(),
          borderColor: this.getRandomColor(),
          pointBackgroundColor: this.getRandomColor(),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.getRandomColor(),
          fill: 'origin',
          yAxisID: 'y1',
        });
        this.datasets.push({
          data: [dataObj.totalFat],
          label: 'Zsír',
          backgroundColor: this.getRandomColor(),
          borderColor: this.getRandomColor(),
          pointBackgroundColor: this.getRandomColor(),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.getRandomColor(),
          fill: 'origin',
        });
      } else {
        this.datasets[0].data.push(dataObj.totalProtein);
        this.datasets[1].data.push(dataObj.totalCarbonhydrate);
        this.datasets[2].data.push(dataObj.totalFat);
      }
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

  getDayName(type: string): string{
    switch(type){
      case "Monday":
        return "Hétfő";
      case "Tuesday":
        return "Kedd";
      case "Wednesday":
        return "Szerda";
      case "Thursday":
        return "Csütörtök";
      case "Friday":
        return "Péntek";
      case "Saturday":
        return "Szombat";
      case "Sunday":
        return "Vasárnap";
      default:
        return "";
    }
  }
}
